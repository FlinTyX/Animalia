package animalia.entities.units;

import static animalia.content.AniFx.landSmoke;

import animalia.content.AniUnitTypes;
import animalia.type.unit.FrogType;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Angles;
import arc.math.Mathf;
import arc.math.geom.Vec2;
import arc.util.*;
import mindustry.gen.Building;
import mindustry.gen.MechUnit;
import mindustry.gen.Unit;
import mindustry.world.blocks.environment.Floor;

public class FrogEntity extends MechUnit {
    protected Interval timer = new Interval();

    public Vec2 target = new Vec2();
    public @Nullable Building over; //block or tree this frog is on

    public boolean jumping, swimming, gliding;
    public float time = 0, extension = 0, step = 0;

    public void jump(float angle){
        lookAt(rotation + Mathf.range(angle));

        landSmoke.at(x, y);
        target.trns(rotation, type().jumpSize).add(x, y);

        jumping = true;
        extension = type().jumpTime;
        step = dst(target) * 1.5f / type().jumpSize;
    }

    public void swim(){
        swimming = true;
        extension = type().swimTime + Mathf.range(3.65f);
    }

    public void idle(){
        if(jumping || gliding){
            landSmoke.at(x, y);
        }

        jumping = swimming = gliding = false;
        time = extension = step = 0;
    }

    public boolean onLiquid(){
        Floor f = floorOn();
        return f != null && !f.solid && f.isLiquid && !jumping;
    }

    public float slope(){
        return extension > 0 ? Math.abs((0.5f - Math.abs((time / extension) - 0.5f)) * 2) : 0;
    }

    public boolean canSwim(){
        return !swimming;
    }

    public boolean canJump(){
        return timer.get(0, type().jumpSize * 1.7f) &&
               !jumping && !swimming && !onLiquid() &&
               !(isShooting && type().usesTongue);
    }

    public float rotateSpeed(){
        return onLiquid() ? type().rotateSpeed : 360f;
    }

    @Override
    public boolean canShoot(){
        return !moving() && (!type().usesTongue || (
                    !(swimming || jumping || gliding) &&
                    mounts[0].target != null &&
                    mounts[0].target instanceof Unit u &&
                    Math.abs(rotation - angleTo(u)) < 3.6f
               ));
    }

    @Override
    public float floorSpeedMultiplier(){
        return 1;
    }

    @Override
    public void update(){
        super.update();

        if(time < extension){
            time += Time.delta;
        } else idle();

        if(jumping || gliding || (swimming && onLiquid())){
            if(onLiquid()){
                lookAt(Mathf.randomSeed((long) extension, 360));
                moveAt(Tmp.v1.trns(rotation, speed()));
            } else {
                vel.trns(rotation, step * slope());
            }
        }
    }

    public void drawOutlineRegion(TextureRegion region, float width, float height){
        Draw.rect(region, x, y, width * Draw.scl * Draw.xscl, height * Draw.scl * Draw.yscl, rotation - 90);
    }

    @Override
    public void rotateMove(Vec2 vec){
        moveAt(Tmp.v2.trns(rotation, vec.len()));
        if(!vec.isZero()) lookAt(vec.angle());
    }

    @Override
    public void lookAt(float angle){
        rotation = Angles.moveToward(rotation, angle, rotateSpeed() * Time.delta);
    }

    @Override
    public void movePref(Vec2 movement){
        rotateMove(movement);
    }

    @Override
    public void moveAt(Vec2 vector, float acceleration){
        if(!vector.isZero()){
            lookAt(vector.angle());

            if(canJump()){
                jump(0);
            } else if(onLiquid()){
                super.moveAt(vector, acceleration);
            }
        }
    }

    @Override
    public void wobble(){
        //no
    }

    @Override
    public FrogType type(){
        return (FrogType) this.type;
    }

    @Override
    public int classId(){
        return AniUnitTypes.classID(FrogEntity.class);
    }
}

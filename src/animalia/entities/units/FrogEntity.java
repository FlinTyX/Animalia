package animalia.entities.units;

import static animalia.content.AniFx.landSmoke;

import animalia.content.AniUnitTypes;
import animalia.type.unit.FrogType;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Angles;
import arc.math.Mathf;
import arc.math.geom.Vec2;
import arc.util.Interval;
import arc.util.Nullable;
import arc.util.Time;
import arc.util.Tmp;
import mindustry.Vars;
import mindustry.gen.Building;
import mindustry.gen.MechUnit;
import mindustry.graphics.Layer;
import mindustry.world.blocks.environment.Floor;

public class FrogEntity extends MechUnit {
    protected Interval timer = new Interval();

    public Vec2 target = new Vec2();
    public @Nullable Building over; //block or tree this frog is on

    public boolean jumping, swimming, gliding;
    public float time = 0, extension = 0, step = 0;

    public void jumpTo(float x, float y){
        lookAt(x, y);

        float size = type().jumpSize;

        landSmoke.at(x, y);
        target.set(x / Vars.tilesize, y / Vars.tilesize).clamp(-size, -size, size, size);

        jumping = true;
        extension = type().jumpTime;
        step = dst(target) * 1.5f / type().jumpSize;
    }

    public void jump(float angle){
        lookAt(rotation + Mathf.range(angle));

        landSmoke.at(x, y);
        target.trns(rotation, type().jumpSize).add(x, y);

        jumping = true;
        extension = type().jumpTime;
        step = dst(target) * 1.5f / type().jumpSize;
    }

    public void glide(float angle){
        lookAt(rotation + Mathf.range(angle));

        //no smoke?
        target.trns(rotation, type().jumpSize).add(x, y);

        gliding = true;
        extension = type().glideTime;
        step = dst(target) * 1.5f / type().glideSize;
    }

    public void swim(){
        target.trns(rotation, type().swimSize).add(x, y);

        swimming = true;
        extension = type().swimTime + Mathf.range(3.65f);
        step = dst(target) * 1.5f / type().swimSize;
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
        return swimming = f != null && !f.solid && f.isLiquid && !jumping;
    }

    public float slope(){
        return Math.abs((0.5f - Math.abs((time / extension) - 0.5f)) * 2);
    }

    public boolean canSwim(){
        return !swimming;
    }

    public boolean canJump(){
        return timer.get(0, type().jumpSize * 1.3f) &&
               !(jumping || swimming) && !onLiquid() &&
               !(isShooting && type().usesTongue);
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

        if(jumping || swimming || gliding){
            if(onLiquid()) {
                rotation = Angles.moveToward(rotation, Mathf.randomSeed((long) extension, 360), Time.delta * 2);
            }

            vel.trns(rotation, step * slope());
        }
    }

    @Override
    public void draw(){
        FrogType type = type();

        Draw.z(Layer.groundUnit - 0.001f);

        if(!jumping){
            if(!onLiquid()){

                drawOutlineRegion(type.outlineRegion, type.outlineRegion.width, type.outlineRegion.height);
                Draw.rect(type.region, x, y, rotation - 90);

            } else {

                drawOutlineRegion(type.swimOutlineRegion, type.swimOutlineRegion.width, type.swimOutlineRegion.height);
                Draw.rect(type.swimRegion, x, y, rotation - 90);

            }
        } else {
            //complete shit

            float elevation = 8 * slope();

            Draw.reset();

            type.applyColor(self());
            type.applyOutlineColor(self());

            Draw.rect(
                type.jumpOutlineRegion, x, y,
                type.jumpOutlineRegion.width * Draw.scl * Draw.xscl + elevation,
                type.jumpOutlineRegion.height * Draw.scl * Draw.yscl + elevation, rotation - 90
            );

            Draw.reset();

            Draw.rect(
                type.jumpRegion, x, y,
                type.jumpRegion.width * Draw.scl + elevation,
                type.jumpRegion.height * Draw.scl + elevation, rotation - 90
            );
        }

        Draw.z(Layer.groundUnit);
        super.draw();
    }

    public void drawOutlineRegion(TextureRegion region, float width, float height){
        Draw.reset();

        type.applyColor(self());
        type.applyOutlineColor(self());

        Draw.rect(region, x, y, width * Draw.scl * Draw.xscl, height * Draw.scl * Draw.yscl, rotation - 90);
        Draw.reset();
    }

    @Override
    public void rotateMove(Vec2 vec){
        moveAt(Tmp.v2.trns(rotation, vec.len()));

        if(!vec.isZero()){
            rotation = Angles.moveToward(rotation, vec.angle(), type.rotateSpeed * Time.delta);
        }
    }

    @Override
    public void moveAt(Vec2 vector, float acceleration){
        //acceleration = step ???
        if(canJump()){
            lookAt(Angles.angle(vector.x, vector.y));
            jump(0);
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

package animalia.type.unit;

import animalia.ai.types.FrogAI;
import animalia.content.AniFx;
import animalia.content.Spawners;
import animalia.entities.units.FrogEntity;
import animalia.type.Adaption;
import arc.Core;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.Fill;
import arc.graphics.g2d.Lines;
import arc.graphics.g2d.TextureRegion;
import arc.math.Angles;
import arc.math.Mathf;
import arc.util.Tmp;
import mindustry.entities.units.WeaponMount;
import mindustry.gen.Mechc;
import mindustry.gen.Unit;
import mindustry.graphics.Layer;
import mindustry.type.Weapon;
import mindustry.world.Block;
import mindustry.world.meta.Stat;

import static animalia.ui.AniUI.*;

public class FrogType extends AnimalType {
    public boolean usesTongue = false;

    public float
    tongueReload = 120,
    tongueMaxCap =  13,

    swimTime = 400,
    swimSize = 10,
    swimChance = 0.003f,

    jumpTime = 40,
    jumpSize = 5,
    jumpChance = 0.003f,

    glideTime = -1,
    glideSize = 9,
    glideChance = 0.001f;

    public TextureRegion
    swimRegion,
    swimOutlineRegion,
    jumpRegion,
    jumpOutlineRegion;

    public FrogType(String name){
        super(name);

        isEnemy = false;
        canDrown = false;
        flying = false;
        drawBody = true;
        drawCell = false;
        useUnitCap = false;
        outlines = false;
        alwaysCreateOutline = false;
        playerControllable = true;
        rotateMoveFirst = true;
        rotateSpeed = 360;
        mechStepParticles = false;
        mechFrontSway = 0;
        mechSideSway = 0;
        mechLandShake = 0;
        itemCapacity = 0;
        speed = 0.00012f;
        hitSize = 10;

        controller = u -> new FrogAI();
        constructor = FrogEntity::new;

        Spawners.frog.push(this);
    }

    public void init(){
        super.init();

        if(glideTime > 0){
            adaption = Adaption.arboreal;
            shadowRegion = jumpRegion;
        }

        if(usesTongue){
            weapons.add(new Weapon(){{
                    x = 0;
                    y = 0;
                    reload = tongueReload;
                    rotate = false;
                    shootCone = 3.6f;
                }

                @Override
                protected void shoot(Unit unit, WeaponMount mount, float shootX, float shootY, float rotation){}

                @Override
                public void draw(Unit unit, WeaponMount mount){
                    super.draw(unit, mount);

                    if(mount.target != null && mount.shoot && mount.reload > 0){
                        Unit u = (Unit) mount.target;

                        u.vel.set(0, 0);
                        u.impulse(Tmp.v1.trns(u.angleTo(unit), unit.dst2(u) * 0.6f));

                        if (u.within(unit.x, unit.y, unit.hitSize + (u.hitSize / 2))) {
                            AniFx.unitRemove.at(u.x, u.y, u.angleTo(unit), u);
                            u.remove();
                        }

                        Draw.z(Layer.groundUnit - 1);
                        Lines.stroke(1.4f, Color.valueOf("c45f5f"));
                        Lines.line(unit.x, unit.y, u.x, u.y);
                        Fill.circle(u.x, u.y, 1.6f);
                    }
                }
            });
        }
    }

    @Override
    public void load(){
        super.load();

        jumpRegion = Core.atlas.find(name + "-jump");
        swimRegion = Core.atlas.find(name + "-swim");

        swimOutlineRegion = Core.atlas.find(name + "-swim-outline");
        jumpOutlineRegion = Core.atlas.find(name + "-jump-outline");
    }

    @Override
    public void drawSoftShadow(Unit unit){
        FrogEntity u = (FrogEntity) unit;

        if(u.onLiquid()) drawSoftShadow(unit, 1f);

        drawSoftShadow(unit, 1f - u.slope());
    }

    @Override
    public void setStats(){
        super.setStats();
        stats.remove(Stat.speed);

        if(usesTongue) stats.remove(Stat.weapons);

        String floors = "[]";

        for(Block b : spawnsOn){
            floors += b.localizedName + (spawnsOn.indexOf(b) < spawnsOn.size - 1 ? ", " : "");
        }

        addStats(stats, Stat.flying, true,
            statValueBundle("stat.swim", "yes"),
            statValueBundle("stat.jump", "yes"),
            statValueBundle("stat.glide", isArboreal() ? "yes" : "no"),
            statValue("stat.spawns", floors),
            statValue("stat.jumpsize", jumpSize + " " + Core.bundle.get("unit.blocks")),
            statValue("stat.swimsize", swimSize + " " + Core.bundle.get("unit.blocks"))
        );
    }

    @Override
    public void drawBody(Unit u){
        FrogEntity unit = (FrogEntity) u;

        applyColor(u);

        if(!unit.jumping && !unit.gliding){
            if(!unit.onLiquid()){

                unit.drawOutlineRegion(outlineRegion, outlineRegion.width, outlineRegion.height);
                Draw.rect(region, unit.x, unit.y, unit.rotation - 90);

            } else {

                unit.drawOutlineRegion(swimOutlineRegion, swimOutlineRegion.width, swimOutlineRegion.height);
                Draw.rect(swimRegion, unit.x, unit.y, unit.rotation - 90);

            }
        } else {
            //complete shit

            float elevation = 8 * unit.slope();

            Draw.rect(
                    jumpOutlineRegion, unit.x, unit.y,
                    jumpOutlineRegion.width * Draw.scl * Draw.xscl + elevation,
                    jumpOutlineRegion.height * Draw.scl * Draw.yscl + elevation, unit.rotation - 90
            );

            Draw.rect(
                    jumpRegion, unit.x, unit.y,
                    jumpRegion.width * Draw.scl + elevation,
                    jumpRegion.height * Draw.scl + elevation, unit.rotation - 90
            );
        }
    }

    @Override
    public void drawCell(Unit unit){
        //no
    }

    @Override
    public void drawMech(Mechc mech){
        //no
    }

    @Override
    public void drawEngines(Unit unit){
        //no
    }

    @Override
    public void drawOutline(Unit unit){
        //no
    }

}

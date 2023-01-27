package animalia.type.unit;

import animalia.ai.types.FrogAI;
import animalia.content.Spawners;
import animalia.entities.units.FrogEntity;
import animalia.type.Adaption;
import arc.Core;
import arc.graphics.g2d.TextureRegion;
import mindustry.gen.Mechc;
import mindustry.gen.Unit;
import mindustry.world.Block;
import mindustry.world.meta.Stat;

import static animalia.ui.AniUI.*;

public class FrogType extends AnimalType {
    public boolean usesTongue = false;

    public float
    swimTime = 400,
    swimSize = 20,
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
        drawBody = false;
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
    }

    @Override
    public void load(){
        super.load();

        cellRegion = Core.atlas.find("");
        jumpRegion = Core.atlas.find(name + "-jump");
        swimRegion = Core.atlas.find(name + "-swim");

        swimOutlineRegion = Core.atlas.find(name + "-swim-outline");
        jumpOutlineRegion = Core.atlas.find(name + "-jump-outline");
    }

    @Override
    public void drawSoftShadow(Unit unit){
        FrogEntity u = (FrogEntity) unit;

        if(u.onLiquid()) drawSoftShadow(unit, 1f);

        drawSoftShadow(unit, 0.5f - u.slope());
    }

    @Override
    public void setStats(){
        super.setStats();
        stats.remove(Stat.speed);

        String floors = "[]";

        for(Block b : spawnsOn){
            floors += b.localizedName + (spawnsOn.indexOf(b) < spawnsOn.size - 1 ? ", " : "");
        }

        addStats(stats, Stat.flying, true,
            statValueBundle("stat.swim", "yes"),
            statValueBundle("stat.jump", "yes"),
            statValueBundle("stat.glide", isArboreal() ? "yes" : "false"),
            statValue("stat.spawns", floors),
            statValue("stat.jumpsize", jumpSize + " " + Core.bundle.get("unit.blocks")),
            statValue("stat.swimsize", swimSize + " " + Core.bundle.get("unit.blocks"))
        );
    }

    @Override
    public void drawMech(Mechc mech){
        //no
    }

    @Override
    public void drawEngines(Unit unit){
        //no
    }
}

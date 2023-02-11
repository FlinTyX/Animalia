package animalia.ai.types;

import animalia.entities.units.FrogEntity;
import animalia.type.unit.FrogType;
import animalia.world.environment.SeasonalTree.SeasonalTreeBuild;
import arc.math.Angles;
import arc.math.Mathf;
import arc.math.geom.Point3;
import arc.util.Interval;
import arc.util.Time;
import mindustry.Vars;
import mindustry.core.World;
import mindustry.entities.Units;
import mindustry.entities.units.AIController;
import mindustry.gen.Teamc;
import mindustry.gen.Unit;

public class FrogAI extends AIController {
    @Override
    public void updateMovement(){
        FrogEntity u = (FrogEntity) unit;

        if(u.type().usesTongue){
            faceTarget();
        }

        if(u.type().isArboreal()){
            SeasonalTreeBuild tree = (SeasonalTreeBuild) Units.closestBuilding(u.team,  u.x, u.y, u.type().jumpSize, b -> b instanceof SeasonalTreeBuild);

            if(tree != null){
                Point3 branch = tree.closestBranch(u.x, u.y);

                u.lookAt(u.angleTo(tree.x + branch.x, tree.y + branch.y));
                u.jump(0);
            }
        }

        if(u.over != null){

        } else {
            if(Mathf.chance(u.type().swimChance) && u.onLiquid() && u.canSwim()) {
                u.swim();
                return;
            }

            if (Mathf.chance(u.type().jumpChance) && u.canJump()) {
                u.jump(60);
            }
        }
    }

    @Override
    public void faceTarget(){
        FrogEntity u = (FrogEntity) unit;

        if(target != null && !(u.jumping || u.swimming || u.gliding)){
            unit.rotation = Angles.moveToward(unit.rotation, unit.angleTo(target), Time.delta * 4);
        } else if(unit.moving()){
            unit.lookAt(unit.vel().angle());
        }
    }

    @Override
    public boolean invalid(Teamc target){
        return Units.invalidateTarget(target, unit.team, unit.x, unit.y) ||
            !(target instanceof Unit u && (u.type.flying || u.hitSize <= ((FrogType) unit.type()).tongueMaxCap) && !World.raycast(
                World.toTile(unit.x),
                World.toTile(unit.y),
                World.toTile(u.x),
                World.toTile(u.y),
                (x, y) -> Vars.world.build(x, y) != null || Vars.world.tile(x, y).solid()
            ));
    }
}

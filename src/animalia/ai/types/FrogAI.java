package animalia.ai.types;

import animalia.entities.units.FrogEntity;
import animalia.world.environment.SeasonalTree.SeasonalTreeBuild;
import arc.math.Angles;
import arc.math.Mathf;
import arc.math.geom.Point3;
import arc.util.Interval;
import arc.util.Time;
import mindustry.entities.Units;
import mindustry.entities.units.AIController;

public class FrogAI extends AIController {
    protected Interval action = new Interval();

    @Override
    public void updateMovement(){
        FrogEntity u = (FrogEntity) unit;

        if(u.type().usesTongue){
            //TODO frog tongue
            updateWeapons();
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

        if(u.over != null) {
            if (Mathf.chance(u.type().swimChance) && u.onLiquid() && u.canSwim()) {
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
        if(target != null && unit.canShoot()){
            unit.rotation = Angles.moveToward(unit.rotation, unit.angleTo(target), Time.delta * 4);
        } else if(unit.moving()){
            unit.lookAt(unit.vel().angle());
        }
    }
}

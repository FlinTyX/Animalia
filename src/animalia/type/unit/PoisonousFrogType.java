package animalia.type.unit;

import animalia.content.AniStatuses;
import mindustry.entities.Units;
import mindustry.gen.Unit;
import mindustry.type.StatusEffect;
import mindustry.world.meta.Stat;

import static animalia.ui.AniUI.*;

public class PoisonousFrogType extends FrogType {
    public StatusEffect effect = AniStatuses.poisoned;
    public float effectTime = 60 * 3.5f;

    public PoisonousFrogType(String name){
        super(name);
    }

    @Override
    public void setStats(){
        super.setStats();

        addStats(stats, Stat.size, true, statValueBundle("stat.poisonous", "true"));
    }

    @Override
    public void update(Unit unit){
        super.update(unit);

        Units.nearby(unit.team, unit.x, unit.y, unit.type.range, u -> {
            if(u != unit && !u.type.flying && !(u.type() instanceof PoisonousFrogType)){
                u.apply(effect, effectTime);
            }
        });
    }
}

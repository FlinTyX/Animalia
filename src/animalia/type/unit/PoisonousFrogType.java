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

        addStats(stats, Stat.size, true, statValueBundle("stat.poisonous", "yes"));
    }

    @Override
    public void update(Unit unit){
        super.update(unit);

        float r = unit.type.range;

        Units.nearby(unit.x - r, unit.y - r, r * 2, r * 2, u -> {
            if(u.within(unit.x, unit.y, r + u.hitSize / 2f) && !u.type.flying && !(u.type() instanceof PoisonousFrogType)){
                u.apply(effect, effectTime);
            }
        });
    }
}

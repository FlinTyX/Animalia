package animalia.type;

import animalia.type.unit.AnimalType;
import arc.Core;
import arc.graphics.Color;
import arc.graphics.g2d.TextureRegion;
import arc.util.Nullable;
import mindustry.type.Item;
import mindustry.world.meta.Stat;

import static animalia.ui.AniUI.*;

public class EggType extends Item {
    public @Nullable AnimalType unit;
    public float time = 0;

    public TextureRegion upRegion;

    public EggType(String name, AnimalType unit, Color color, float time){
        super(name, color);

        this.unit = unit;
        this.time = time * 60;

        if(unit != null) unit.egg = this;
    }

    public EggType(String name, Color color){
        super(name, color);
    }

    @Override
    public void load(){
        super.load();
        upRegion = Core.atlas.find(name + "-up");
    }

    @Override
    public void setStats(){
        super.setStats();

        addStats(stats, Stat.explosiveness, true,
            statValue("stat.hatch", (time / 60) + " " + Core.bundle.get("unit.seconds"))
        );
    }
}

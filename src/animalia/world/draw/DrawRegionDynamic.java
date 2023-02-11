package animalia.world.draw;

import arc.func.Func;
import arc.graphics.g2d.TextureRegion;
import mindustry.gen.Building;
import mindustry.world.draw.DrawBlock;

public class DrawRegionDynamic extends DrawBlock {
    public Func<Building, TextureRegion> run;

    public DrawRegionDynamic(Func<Building, TextureRegion> run){
        this.run = run;
    }
}

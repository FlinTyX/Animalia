package animalia.world.draw;

import arc.func.Func;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import mindustry.gen.Building;
import mindustry.graphics.Drawf;
import mindustry.graphics.Layer;

public class DrawConstruct extends DrawRegionDynamic {
    public TextureRegion top;

    public DrawConstruct(Func<Building, TextureRegion> run){
        super(run);
    }

    @Override
    public void draw(Building build){
        Draw.rect(build.block.region, build.x, build.y, build.block.rotate ? build.rotdeg() : 0);

        Draw.draw(Layer.blockOver, () -> {
            Draw.reset();
            Drawf.construct(build, run.get(build), 0, build.progress(), build.warmup(), build.totalProgress());
        });
    }
}

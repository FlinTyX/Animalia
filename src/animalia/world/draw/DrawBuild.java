package animalia.world.draw;

import arc.Core;
import arc.func.Func;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.Fill;
import arc.graphics.g2d.Lines;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import arc.util.Time;
import mindustry.Vars;
import mindustry.gen.Building;
import mindustry.graphics.Drawf;
import mindustry.graphics.Layer;
import mindustry.world.Block;

import static animalia.content.AniShaders.blockBuild;

public class DrawBuild extends DrawRegionDynamic {
    public Color color;

    public DrawBuild(Color color, Func<Building, TextureRegion> run){
        super(run);
        this.color = color;
    }

    @Override
    public void draw(Building build){
        TextureRegion region = run.get(build);

        if(region != null) {
            Draw.draw(Layer.block, () -> {
                Drawf.construct(build.x, build.y, region, color, 0, build.progress(), build.warmup(), build.totalProgress());

                Draw.color(color);
                Draw.alpha(build.warmup());
                Lines.lineAngleCenter(build.x + Mathf.sin(build.totalProgress(), 20, Vars.tilesize / 2 * build.block.size - 2), build.y, 90, build.block.size * Vars.tilesize - 4);
                Draw.reset();

                Vars.renderer.effectBuffer.begin(Color.clear);

                Draw.color(color);
                Draw.alpha(build.warmup() * (0.85f + Mathf.sin(Time.time, 10, 0.08f)));
                Fill.square(build.x, build.y, build.block.size * Vars.tilesize / 2);

                Vars.renderer.effectBuffer.end();
                Vars.renderer.effectBuffer.blit(blockBuild);
            });
        }

        Draw.reset();
        Draw.rect(build.block.region, build.x, build.y, build.block.rotate ? build.rotdeg() : 0);
    }
}

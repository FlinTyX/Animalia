package animalia.world.environment;

import arc.Core;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import arc.math.geom.Point3;
import arc.struct.Seq;
import arc.util.Time;
import mindustry.Vars;
import mindustry.gen.Building;
import mindustry.graphics.Layer;
import mindustry.world.Block;
import mindustry.world.Tile;
import mindustry.world.meta.BuildVisibility;

public class SeasonalTree extends Block{
    public int layers = 3;

    public TextureRegion[]
    regions = new TextureRegion[layers],
    shadows = new TextureRegion[layers];

    public TextureRegion shadowRegion;

    public Seq<Point3> branches = Seq.with(
        new Point3(6, 0, 0), new Point3(14, 0, 0),
        new Point3(19, -1, 0), new Point3(23, -5,  0),
        new Point3(22, -11, 0), new Point3(19, -19, 0),
        new Point3(30, -5, 0), new Point3(33, 2, 0),
        new Point3(-6, 5, 0), new Point3(-8, 12, 0),
        new Point3(-10, 18, 0), new Point3(-18, 22, 0)
    );


    public SeasonalTree(String name){
        super(name);

        solid = true;
        update = true;
        replaceable = false;
        destructible = false;
        targetable = false;
        clipSize = 500 * Draw.scl;

        buildVisibility = BuildVisibility.editorOnly;
    }

    @Override
    public TextureRegion[] icons(){
        return regions;
    }

    @Override
    public void load(){
        super.load();

        for(int i = 0; i < layers; i++){
            regions[i] = Core.atlas.find(name + "-" + i);
            shadows[i] = Core.atlas.find(name + "-shadow-" + i);
        }

        shadowRegion = Core.atlas.find("circle-shadow");
        region = regions[0];
    }

    @Override
    public boolean canBreak(Tile tile){
        return Vars.state.isEditor();
    }

    public class SeasonalTreeBuild extends Building implements SeasonalBlock {
        public Seq<Point3> occupied = new Seq<>();

        @Override
        public void draw(){
            float fin = 1 - Core.camera.width / Core.graphics.getWidth(),
                  f = Math.max(1, fin + 0.35f),
                  scl = 40f, mag = 0.35f;

            for(int i = 0; i < layers; i++){
                TextureRegion region = regions[i], shadow = shadows[i];

                float w = region.width * region.scl() * f,
                      h = region.height * region.scl() * f,
                      step = 0.4f + (i + 1) / layers;

                //real shadow
                Draw.z(Layer.power + 0.5f);
                Draw.rect(shadow, x, y);

                //circle shadows & regions
                Draw.z(Layer.power + 1);
                Draw.color(0f, 0f, 0f, 0.3f - (fin * 0.35f));
                Draw.rect(shadowRegion, x, y, 100, 100);
                Draw.color();

                Draw.alpha(1 - (fin - (i < 1 ? 1 : step)));
                Draw.rectv(region, x, y, w, h, 0, vec -> vec.add(
                    Mathf.sin(vec.y * 3 + Time.time, scl, mag) + Mathf.sin(vec.x * 3 - Time.time, 70, 0.8f),
                    Mathf.cos(vec.x * 3 + Time.time + 8, scl + 6f, mag * 1.1f) + Mathf.sin(vec.y * 3 - Time.time, 50, 0.2f)
                ));
            }
        }

        public Point3 closestBranch(float x, float y){
            Point3 branch = null;

            float dst = -1;

            for(Point3 pos : branches){
                if(occupied.contains(pos)) continue;

                float dst2 = Mathf.dst2(x + pos.x, y + pos.y, x, y);

                if(dst < 0 || dst2 <  dst){
                    dst = dst2;
                    branch = pos;
                }
            }

            return branch;
        }
    }
}

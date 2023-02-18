package animalia.world.power;

import arc.Core;
import arc.graphics.Blending;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import mindustry.Vars;
import mindustry.gen.Building;
import mindustry.gen.Call;
import mindustry.graphics.Drawf;
import mindustry.graphics.Layer;
import mindustry.graphics.Pal;
import mindustry.type.Category;
import mindustry.world.blocks.power.PowerBlock;
import mindustry.world.meta.Stat;

public class DischargeReceptor extends PowerBlock {
    public float range = 180f, offsetY = 4.4f;
    public TextureRegion softShadowRegion, heatRegion, rodRegion;

    public DischargeReceptor(String name){
        super(name);

        category = Category.power;
        sync = true;
        hasPower = true;
        consumesPower = false;
    }

    @Override
    public void load(){
        super.load();

        softShadowRegion = Core.atlas.find("circle-shadow");
        heatRegion = Core.atlas.find(name + "-heat");
        rodRegion = Core.atlas.find(name + "-rod");
    }

    @Override
    public void setStats(){
        super.setStats();
        stats.remove(Stat.powerUse);
    }

    @Override
    public void drawPlace(int x, int y, int rotation, boolean valid){
        super.drawPlace(x, y, rotation, valid);
        Drawf.dashCircle((x * Vars.tilesize) + offset, (y * Vars.tilesize) + offset, range, Pal.power);
    }

    public class ReceptorBuild extends Building {
        public float heat = 0;

        public float offsetY(){
            return offsetY;
        }

        public void charge(float amount){
            if(power != null){
                power.graph.chargeBatteries(amount * 60);
                heat = 1f;

                if(power.graph.getBatteryStored() / power.graph.getTotalBatteryCapacity() == 1f){
                    power.graph.all.each(build -> {
                        if(build.block instanceof PowerBlock){
                            Call.buildDestroyed(build);
                        }
                    });
                } else if(Mathf.chanceDelta(0.2f)){
                    damage(20f);
                }
            }
        }

        @Override
        public void updateTile(){
            super.updateTile();

            if(power != null){
                enabled = power.graph.batteries.size > 0f;
                heat = Mathf.lerpDelta(heat, 0f, 0.005f);
            }
        }

        @Override
        public void draw(){
            super.draw();
            float rad = 1.6f, size = 22 * Draw.scl;

            Draw.z(Layer.turret + 0.001f);
            Draw.color(0f, 0f, 0f, 0.34f);

            Draw.rect(softShadowRegion, this, size * rad * Draw.xscl, size * rad * Draw.yscl, rotdeg());
            Draw.color();

            Drawf.shadow(
                rodRegion,
                x - offsetY * 0.8f,
                y - offsetY * 0.8f,
                rodRegion.width * 0.8f * Draw.scl * Draw.xscl,
                rodRegion.height * 1.3f * Draw.scl * Draw.xscl,
                130
            );

            Draw.rect(rodRegion, x, y + offsetY / 2, 2.5f);

            if(heat > 0.0001f){
                Draw.color(Pal.meltdownHit, heat);
                Draw.blend(Blending.additive);
                Draw.rect(heatRegion, x, y + offsetY / 2, 2.5f);
                Draw.blend();
                Draw.color();
            }
        }

        @Override
        public void drawSelect(){
            Drawf.dashCircle(x, y, range, Pal.power);
        }
    }
}
package animalia.world.units;

import animalia.type.EggType;
import arc.Core;
import arc.graphics.Blending;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Angles;
import arc.math.Mathf;
import arc.math.geom.Vec2;
import arc.scene.ui.Image;
import arc.scene.ui.Label;
import arc.scene.ui.layout.Table;
import arc.struct.Seq;
import arc.util.Eachable;
import arc.util.Nullable;
import arc.util.Time;
import arc.util.Tmp;
import arc.util.io.Reads;
import arc.util.io.Writes;
import mindustry.entities.units.BuildPlan;
import mindustry.gen.Building;
import mindustry.gen.Icon;
import mindustry.graphics.Layer;
import mindustry.graphics.Pal;
import mindustry.type.Category;
import mindustry.type.Item;
import mindustry.ui.Bar;
import mindustry.ui.ItemImage;
import mindustry.world.blocks.payloads.Payload;
import mindustry.world.blocks.payloads.PayloadBlock;
import mindustry.world.blocks.payloads.UnitPayload;
import mindustry.world.meta.Stat;

import static animalia.content.AniFx.hatchSmoke;
import static mindustry.Vars.*;

@SuppressWarnings({"SpellCheckingInspection", "unused"})
public class Incubator extends PayloadBlock {    public TextureRegion heatRegion, softShadowRegion;

    public Incubator(String name){
        super(name);

        outputsPayload = true;
        rotate = true;
        solid = true;
        update = true;
        hasItems = true;
        sync = true;

        itemCapacity = 1;
        category = Category.units;
    }

    @Override
    public void load(){
        super.load();

        heatRegion = Core.atlas.find(name + "-heat");
        softShadowRegion = Core.atlas.find("circle-shadow");
    }

    @Override
    public TextureRegion[] icons(){
        return new TextureRegion[]{region, topRegion};
    }

    public boolean eggValid(Item i){
        return i instanceof EggType && !i.name.contains("eggshell");
    }

    @Override
    public void setBars(){
        super.setBars();

        addBar("progress", b -> new Bar("stat.health", Pal.health, ((IncubatorBuild) b)::fraction));
    }

    @Override
    public void drawPlanRegion(BuildPlan plan, Eachable<BuildPlan> list){
        Draw.rect(region, plan.drawx(), plan.drawy());
        Draw.rect(outRegion, plan.drawx(), plan.drawy(), plan.rotation * 90);
        Draw.rect(topRegion, plan.drawx(), plan.drawy());
    }

    @Override
    public void setStats(){
        super.setStats();

        Seq<Item> eggs = content.items().select(this::eggValid);

        stats.add(Stat.input, table -> {
            table.clear();
            table.row();
            table.center().bottom();

            table.table(t -> {
                t.row();

                for(int j = 0; j < eggs.size; j++) {
                    EggType i = (EggType) eggs.get(j);

                    if ((!i.unit.unlocked() && state.isCampaign())) continue;

                    t.row();
                    t.table(a -> {
                        a.row();
                        a.add(i.unit.localizedName);
                        a.row();
                        a.image().width(400).color(Pal.power).pad(5);
                        a.row();

                        a.table(e -> {
                            //input
                            e.add(Core.bundle.get("stat.input") + ":");
                            e.add(new ItemImage(i.upRegion, 1)).pad(5);
                            e.add("[lightgray]" + i.localizedName);
                            e.row();

                            //output
                            e.add(Core.bundle.get("stat.output") + ":");
                            e.add(new ItemImage(i.unit.shadowRegion, 1)).padLeft(5);
                            e.add("[lightgray]" + i.unit.localizedName);
                            e.row();
                        });
                    }).width(400).padLeft(-10).padTop(15);
                }
            });
        });
    }

    public class IncubatorBuild extends PayloadBlockBuild {
        UnitPayload payload;
        public @Nullable EggType egg;
        public float warmup = 0, progress = 0;

        public float fraction(){
            return progress;
        }

        public void hatch(){
            payload = new UnitPayload(egg.unit.create(team));
            payload.set(x, y, rotdeg() - 90);

            hatchSmoke.at(x, y, Pal.meltdownHit);

            items.remove(egg, 1);
            progress %= 1;
        }

        public void moveOutPayload(){
            if(payload == null) return;

            updatePayload();

            Vec2 dest = Tmp.v1.trns(rotdeg(), size * tilesize/2f);

            payRotation = Angles.moveToward(payRotation, rotdeg(), payloadRotateSpeed * delta());
            payVector.approach(dest, payloadSpeed * delta());

            Building front = front();
            boolean canDump = front == null || !front.tile().solid();
            boolean canMove = front != null && (front.block.outputsPayload || front.block.acceptsPayload);

            if(canDump && !canMove){
                pushOutput(payload, 1f - (payVector.dst(dest) / (size * tilesize / 2f)));
            }

            if(payVector.within(dest, 0.001f)){
                payVector.clamp(-size * tilesize / 2f, -size * tilesize / 2f, size * tilesize / 2f, size * tilesize / 2f);

                if(canMove){
                    if(movePayload(payload)){
                        hatchSmoke.at(x, y, Color.gray);
                        payload = null;
                    }
                }
            }
        }

        @Override
        public void updateTile(){
            super.updateTile();

            warmup = Mathf.approachDelta(warmup, Mathf.num(hasEgg()) * power.status, 0.006f);

            if(shouldOutputPayload()){
                moveOutPayload();
            }

            if(hasEgg()){
                progress += getProgressIncrease(egg.time) * power.status;

                if(progress >= 1){
                    hatch();
                }
            } else progress = progress * warmup;
        }

        @Override
        public void draw(){
            super.draw();

            Draw.rect(region, x, y);
            Draw.rect(outRegion, x, y, rotdeg());

            if(warmup > 0.0001f){
                Draw.color(Color.orange, Color.yellow, Pal.accent, Mathf.absin(Time.time, 8, 1));
                Draw.alpha(warmup * (0.55f + Mathf.absin(Time.time, 10, 0.2f)));
                Draw.blend(Blending.additive);
                Draw.rect(heatRegion, x, y);

                Draw.blend();
                Draw.color();
                Draw.reset();
            }

            if(hasEgg()){

                Draw.rect(egg.upRegion, x, y);

            } else if(payload != null){
                TextureRegion reg = payload.icon();

                float m = 1 + Mathf.sin(Time.time, 25, 0.1f),
                      w = reg.width * Draw.scl * Draw.xscl * m,
                      h = reg.height * Draw.scl * Draw.xscl * m;

                w /= 1.7f;
                h /= 1.7f;

                Draw.rect(reg, x, y, w, h, rotdeg() - 90);
            }

            float size = 30 * Draw.scl;
            Draw.color(0, 0, 0, 0.3f);
            Draw.rect(softShadowRegion, this, size * 1.6f * Draw.xscl, size * 1.6f * Draw.yscl, rotdeg());
            Draw.color();

            Draw.z(Layer.block + 0.002f);
            Draw.rect(topRegion, x, y);
        }

        @Override
        public void display(Table table){
            super.display(table);

            table.row();
            table.table(t -> {
                t.add(new Image()).size(32).pad(5).update(i -> i.setDrawable(
                    hasEgg() ? egg.upRegion : payload != null ? payload.unit.type.fullIcon : Icon.warning.getRegion()
                ));

                t.add(new Label("")).update(l -> l.setText(
                    hasEgg() ? egg.localizedName : payload != null ? payload.unit.type.localizedName : "[gray]" + Core.bundle.get("empty")
                ));
            }).left().pad(5);
        }

        public boolean hasEgg(){
            return egg != null && enabled;
        }

        public boolean shouldOutputPayload(){
            Building front = front();
            return payload != null && front != null && (front.block.outputsPayload || front.block.acceptsPayload);
        }

        @Override
        public void handleItem(Building source, Item item){
            super.handleItem(source, item);
            egg = (EggType) items.first();
        }

        @Override
        public boolean acceptItem(Building source, Item item){
            return eggValid(item) && payload == null && items.get(item) < itemCapacity && source.team.equals(team);
        }

        @Override
        public boolean acceptPayload(Building source, Payload payload){
            return false;
        }

        @Override
        public void write(Writes write){
            super.write(write);
            write.f(progress);
        }

        @Override
        public void read(Reads read, byte revision){
            super.read(read, revision);
            progress = read.f();
        }
    }
}

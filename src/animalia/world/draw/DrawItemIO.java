package animalia.world.draw;

import arc.graphics.g2d.Draw;
import mindustry.gen.Building;
import mindustry.type.Item;
import mindustry.world.draw.DrawBlock;

public class DrawItemIO extends DrawBlock {
    public boolean drawOut = true;
    public float spriteSize = 6f;
    public Item in, out;

    public DrawItemIO(Item in, Item out){
        this.in = in;
        this.out = out;
    }

    public DrawItemIO(Item in, Item out, float spriteSize){
        this.in = in;
        this.out = out;
        this.spriteSize = spriteSize;
    }

    @Override
    public void draw(Building build){
        if(build.items.has(in)){
            Draw.alpha(1f - build.progress());
            Draw.rect(in.fullIcon, build.x, build.y, spriteSize, spriteSize);
        }

        Draw.alpha(build.progress() * 1.3f);
        Draw.rect(out.fullIcon, build.x, build.y, spriteSize, spriteSize);
        Draw.reset();
    }
}

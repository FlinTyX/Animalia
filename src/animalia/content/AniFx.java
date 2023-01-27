package animalia.content;

import arc.*;
import arc.graphics.*;
import arc.graphics.g2d.*;
import arc.math.*;
import mindustry.entities.*;
import mindustry.graphics.*;

public class AniFx {
    public static final Effect

    landSmoke = new Effect(25, e -> {
        Draw.color(Pal.gray, Pal.lightishGray, e.finpow());

        Angles.randLenVectors(e.id, 4, 10 * e.fin(), (x, y) -> {
            Fill.circle(e.x + x, e.y + y, 1.2f * e.fslope());
        });
    }).layer(Layer.groundUnit - 1),

    bioreactor = new Effect(70, 80, e -> {
        Draw.color(Color.valueOf("9c88c3"), Color.valueOf("a387ea"), e.fin());

        float fin = e.fin() * 1.1f * e.fout(Interp.pow10Out);

        Angles.randLenVectors(e.id, 10, 35 * e.fout(), (x, y) -> {
            Fill.circle(e.x + x, e.y + y, 1.2f * fin);
            Fill.circle(e.x + x/3, e.y + y/3, fin * 0.8f);
        });
    }),

    hatchSmoke = new Effect(20, e -> {
        Draw.color(e.color, Pal.lightishGray, e.fin());

        Angles.randLenVectors(e.id, 8, 6 * e.finpow(), (x, y) -> {
            Fill.circle(e.x + x, e.y + y, 1.15f * e.fslope());
        });
    }).layer(Layer.block + 0.001f),

    thunder = new Effect(40, 500, e -> {
        float
            w = 15 * e.fout(),
            w2 = w / 2,
            w3 = w2 * 0.7f,
            h = 130,
            r = Mathf.randomSeed(e.id, -2, 2) * e.fin(),
            ox = Core.camera.width / 2;


        Draw.color(Pal.lancerLaser, Color.purple, e.fin());
        Drawf.tri(e.x, e.y, w, h, r);
        Drawf.tri(e.x, e.y, w, h, r + 180);

        Fill.circle(e.x, e.y, 14 * e.fout());
        Fill.quad(e.x + w2, e.y, e.x - w2, e.y, e.x - w2 * 3, e.y + ox, e.x + w2 * 3, e.y + ox);

        Draw.color();
        Fill.quad(e.x + w3, e.y, e.x - w3, e.y, e.x - w3 * 3, e.y + ox, e.x + w3 * 3, e.y + ox);
        Draw.color(Pal.meltdownHit, Pal.spore, e.fin());

        Angles.randLenVectors(e.id, 15, 40 + 40 * e.finpow(), (x, y) -> {
            Fill.circle(e.x + x, e.y + y, 0.8f * e.fout());
        });

        Angles.randLenVectors(e.id, 15, 60 + (40 * e.fin()), (x, y) -> {
            Fill.circle(e.x + x, e.y + y, e.fout());
        });

        e.scaled(10, i -> {
            Lines.stroke(4 * i.fout());
            Lines.circle(i.x, i.y, 90 * i.fin());
            Lines.circle(i.x, i.y, 50 * e.fout());
        });
    }),

    lightning = new Effect(30, e -> {
        e.scaled(15 + Mathf.randomSeed(e.id, 10), i -> {
            Draw.color(e.color, Pal.spore, i.fin());
            Draw.alpha(Mathf.randomSeed(i.id, 0.8f) * i.fout());
            Fill.square(i.x, i.y, Core.camera.width, Core.camera.height);
        });
    }).layer(Layer.end);
}

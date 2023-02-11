package animalia.content;

import arc.*;
import arc.graphics.*;
import arc.graphics.g2d.*;
import arc.math.*;
import arc.util.Time;
import arc.util.Tmp;
import mindustry.entities.*;
import mindustry.gen.Unit;
import mindustry.graphics.*;

public class AniFx {
    public static final Effect

    unitRemove = new Effect(10f, e -> {
        if(!(e.data instanceof Unit u)) return;

        float m = e.fout() * Draw.scl,
              w = u.type.fullIcon.width * m * Draw.scl,
              h = u.type.fullIcon.height  * m * Draw.scl;

        Tmp.v1.trns(u.rotation, e.fin(Interp.fade) * Math.max(w, h) * 0.6f).add(e.x, e.y);

        Draw.rect(u.type.fullIcon, Tmp.v1.x, Tmp.v1.y, w, h, u.rotation - 90);
    }).layer(Layer.groundUnit),

    landSmoke = new Effect(25f, e -> {
        Draw.color(Pal.gray, Pal.lightishGray, e.finpow());

        Angles.randLenVectors(e.id, 4, 10 * e.fin(), (x, y) -> {
            Fill.circle(e.x + x, e.y + y, 1.2f * e.fslope());
        });
    }).layer(Layer.groundUnit - 1),

    animalSound = new Effect(60f, e -> {
        Draw.color(Pal.darkestMetal);
        Draw.alpha(e.fout(Interp.pow10In));
        Draw.rect("animalia-note-" + Mathf.floor(Mathf.randomSeed(e.id, 2)), e.x + Mathf.sin(Time.time, 6), 6 + e.y + (16 * e.fin()));
    }).layer(Layer.groundUnit + 0.01f),

    bioreactor = new Effect(75f, 80, e -> {
        Draw.color(Color.valueOf("9c88c3"), Color.valueOf("a387ea"), e.fin());

        float fin = e.fin() * 1.1f * e.fout(Interp.pow10Out);

        Angles.randLenVectors(e.id, 15, 25 * e.fout(), (x, y) -> {
            Fill.circle(e.x + x, e.y + y, 1.2f * fin);
            Fill.circle(e.x + x/3, e.y + y/3, fin * 0.8f);
        });
    }),

    hatchSmoke = new Effect(20f, e -> {
        Draw.color(e.color, Pal.lightishGray, e.fin());

        Angles.randLenVectors(e.id, 8, 6 * e.finpow(), (x, y) -> {
            Fill.circle(e.x + x, e.y + y, 1.15f * e.fslope());
        });
    }).layer(Layer.block + 0.001f),

    thunder = new Effect(40f, 500, e -> {
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

    lightning = new Effect(30f, e -> {
        e.scaled(15 + Mathf.randomSeed(e.id, 10), i -> {
            Draw.color(e.color, Pal.spore, i.fin());
            Draw.alpha(Mathf.randomSeed(i.id, 0.8f) * i.fout());
            Fill.square(i.x, i.y, Core.camera.width, Core.camera.height);
        });
    }).layer(Layer.end);
}

package animalia.content;

import arc.Core;
import arc.audio.Sound;
import arc.math.Mathf;
import arc.math.geom.Geometry;
import arc.struct.Seq;
import arc.util.Tmp;
import arc.graphics.Color;

import mindustry.entities.Damage;
import mindustry.entities.Effect;
import mindustry.entities.Lightning;
import mindustry.game.Team;
import mindustry.gen.Building;
import mindustry.gen.Groups;
import mindustry.gen.WeatherState;
import mindustry.graphics.Pal;
import mindustry.world.blocks.storage.CoreBlock;

import animalia.sound.AniSounds;
import animalia.type.Consequence;
import animalia.world.power.DischargeReceptor;
import animalia.world.power.DischargeReceptor.*;

public class Consequences {
    public static class Thunder extends Consequence {
        float damage = 500f, damageRadius = 200f;
        int thunders = 1, thunderShake = 20;

        Effect thunderEffect = AniFx.thunder;
        Sound thunderSound = AniSounds.thunder2;

        public Thunder(){
            super("thunder");
        }

        public void effects(float x, float y){
            Effect.shake(thunderShake, thunderShake, x, y);
            thunderEffect.at(x, y);
            thunderSound.at(x, y);

            if(Tmp.r1.setCentered(x, y, Core.camera.width, Core.camera.height).overlaps(Core.camera.bounds(Tmp.r2))){
                AniFx.lightning.at(x, y, 0, Color.white);
            }
        }

        @Override
        public void update(WeatherState state){
            Seq<Building> builds = new Seq<>();

            Groups.build.each(e -> {
                if(!(e.block instanceof CoreBlock)) builds.add(e);
            });

            for(int i = 0; i < Math.max(1, Math.round(Math.random() * thunders)); i++){
                Building build = builds.select(e -> e != null && e.isValid()).random();

                if(build == null) return;

                ReceptorBuild closestReceptor = (ReceptorBuild) Geometry.findClosest(build.x, build.y, builds.select(e -> e.isValid() && e instanceof ReceptorBuild));

                if(closestReceptor != null && closestReceptor.enabled && build.within(closestReceptor, ((DischargeReceptor) closestReceptor.block).range)){
                    closestReceptor.charge(damage);
                    effects(closestReceptor.x, closestReceptor.y + closestReceptor.offsetY() * 2.2f);

                    return;
                }

                effects(build.x, build.y);
                Damage.damage(build.x, build.y, damageRadius, damage);

                for(int e = 0; e < Math.random() * 20; e++){
                    Lightning.create(Team.derelict, Pal.lancerLaser, damage / 20, build.x, build.y, Mathf.random() * 360, 35);
                }
            }
        }
    }
}
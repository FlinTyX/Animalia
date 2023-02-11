package animalia;

import static mindustry.Vars.*;

import animalia.content.*;
import animalia.ui.AniTex;
import animalia.world.WorldSetup;
import arc.Core;
import arc.Events;
import arc.util.Time;
import mindustry.game.EventType;
import mindustry.game.EventType.*;
import mindustry.mod.Mod;
import animalia.ui.AniUI;

public class Animalia extends Mod {
    public WorldSetup world;
    public AniUI ui = new AniUI();

    public Animalia(){
        super();
    }

    @Override
    public void init(){
        if(!headless) {
            AniTex.load();

            Events.on(ClientLoadEvent.class, e -> ui.load());
            Events.on(WorldLoadEvent.class, e -> Time.run(5, () -> world.onLoad()));
            Events.run(Trigger.newGame, () -> Time.run(3, () -> world.onCreate()));

            Events.run(Trigger.update, () -> {
                world.update();
            });
        }
    }

    @Override
    public void loadContent(){
        AniLiquids.load();
        AniStatuses.load();
        AniUnitTypes.load();
        AniItems.load();
        AniBlocks.load();
        AniWeathers.load();
        AniShaders.load();
        AniTechTree.load();
    }

    public static float sfxvol(){
        return 1f * Core.settings.getInt("sfxvol") / 100f;
    }

    public static float sfxvol(float vol){
        return vol * 1f * Core.settings.getInt("sfxvol") / 100f;
    }
}

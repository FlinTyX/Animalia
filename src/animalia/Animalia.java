package animalia;

import static mindustry.Vars.*;

import animalia.content.AniBlocks;
import animalia.content.AniStatuses;
import animalia.content.AniUnitTypes;
import animalia.world.WorldSetup;
import arc.Core;
import arc.Events;
import mindustry.game.EventType;
import mindustry.game.EventType.*;
import mindustry.mod.Mod;
import animalia.content.AniWeathers;
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
            world.setup();

            Events.on(ClientLoadEvent.class, e -> {
                ui.load();
            });

            Events.run(EventType.Trigger.update, () -> {
                world.update();
            });
        }
    }

    @Override
    public void loadContent(){
        AniWeathers.load();
        AniStatuses.load();
        AniBlocks.load();
        AniUnitTypes.load();
    }

    public static float sfxvol(){
        return 1f * Core.settings.getInt("sfxvol") / 100f;
    }

    public static float sfxvol(float vol){
        return vol * 1f * Core.settings.getInt("sfxvol") / 100f;
    }
}

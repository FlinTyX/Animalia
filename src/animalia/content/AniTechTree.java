package animalia.content;

import static mindustry.content.TechTree.*;
import static animalia.content.AniBlocks.*;
import static animalia.content.AniUnitTypes.*;
import static animalia.content.AniItems.*;
import static animalia.content.AniLiquids.*;

public class AniTechTree {
    public static TechNode root;

    public static void load(){
        root = nodeRoot("animalia", frog, () -> {
            node(leopardFrog, () -> {});
            node(assaultFrog, () -> {});
            node(exoticFrog, () -> {});

            node(eggshellPrinter, () -> {
                node(carbonizer, () -> {
                    node(dischargeReceptor, () -> {});
                    node(chlorophyllSynthesizer, () -> {});
                });

                node(bioreactor, () -> {
                    node(geneticReconstructor, () -> {
                        node(incubator, () -> {});
                    });
                });
            });

            nodeProduce(eggshell, () -> {
                nodeProduce(nutritiveSolution, () -> {});

                nodeProduce(carbonFiber, () -> {
                    nodeProduce(chlorophyll, () -> {});
                });
            });
        });
    }
}

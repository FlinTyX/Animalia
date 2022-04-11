Events.on(ContentInitEvent, () => {
    if(!Vars.headless){
        module.exports["panelClear"] = Core.atlas.drawable("animalia-pane-clear");
        module.exports["sidebarLeft"] = Core.atlas.drawable("animalia-sidebar-left");

        //Icons

        module.exports["frog"] = Core.atlas.drawable("animalia-icon-frog")
    }
});
//register plugin of filePond to use:
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode

)
FilePond.setOptions({
    stylePanelAspectRatio: 100/150,
    imageResizeTargetWidth	: 250,
    imageResizeTargetHeight: 150,

})
//Use to parse syntax
FilePond.parse(document.body);
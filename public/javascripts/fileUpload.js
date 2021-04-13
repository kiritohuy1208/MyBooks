//register plugin of filePond to use:
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode

)
FilePond.setOptions({
    stylePanelAspectRatio: 150/100,
    imageResizeTargetWidth	: 100,
    imageResizeTargetHeight: 150

})
//Use to parse syntax
FilePond.parse(document.body);
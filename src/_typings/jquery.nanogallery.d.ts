/**
 * Custom Typings see: https://goo.gl/aeIq3D
 */
interface JQuery {
    nanoGallery(options:{
        colorScheme?:string,
        thumbnailWidth?:string|number,
        thumbnailLabel?:{},
        viewerDisplayLogo?:boolean,
        thumbnailLazyLoad?:boolean,
        viewerToolbar?:{},
        locationHash?:boolean,
        thumbnailHoverEffect?:string,
        itemsBaseURL?:string,
        supportIE8?:boolean,
        theme?:string,
        lazyBuild?:string
    }): JQuery;
}
/*

    GeneratorConfigEditor.jsx
    geeklystrips@github

    TODO 
        - upgrade INI to JSON
        - adapt _writeConfig() & updatePrefsObj()

    --------------

    Based on 
    
    https://github.com/adobe-photoshop/generator-assets/wiki/Configuration-Options

    https://github.com/adobe-photoshop/generator-assets/wiki/Generate-Image-Assets-Functional-Spec


    Plug-in Configuration
    
    The plug-in can be configured in your user-level generator.json file with the following options:

    working-directory - default value: a temporary directory - Indicates the directory into which assets are generated while running tests
    cleanup - default value: true - Indicates whether or not assets generated while runing tests should be cleaned up afterwards.
    results-log-path - Indicates the file path to which a summary of test results should be written. If not set, no results log is written.
    results-xml-path - Desingates the file path for a Jenkins ingestable JUnit XML summary. If not set, no xml summary will be written.
    autorun - default value: false - Indicates that the automation tests should run automatically on startup.
    selected-tests - default value: [] - Run only tests listed in the value array. If empty, run all.
    honor-generator-assets-config - default value: false - If true then any user-defined generator-assets configurations which are not explicitly set by a test-defined config will be honored.

-----
The Generator Assets plugin for Generator supports the following configuration options:

svg-enabled: Whether or not to allow experimental creation of SVG assets (default: true)
svgomg-enabled: If true (the default), use the experimental svgObjectModelGenerator library for creation of SVG assets. If false, use the built in JSX implementation. Requires svg-enabled to be set to true. (default: true)
css-enabled: Whether to expose the experimental 'Copy Layer CSS To Clipboard' menu option. (default: false)
webp-enabled: Whether or not to allow experimental creation of WEBP assets (only available on Mac OS, currently) (default: false)
webp-lossless: Use lossless compression for webp format. (default: false)
use-smart-scaling: Use Photoshop's "smart" scaling to scale layer, which (confusingly) means that stroke effects (e.g. rounded rect corners) are not scaled. (default: false)
include-ancestor-masks: Cause exported layer to be clipped by any ancestor masks that are visible. (ancestor meaning any group layers that contain the layer). Also incorporates the ancestor layer styling ie. group fx, blend mode, opacity, etc. (default: false)
allow-dither: Force the use of dithering when converting to 8-bit RGB in cases where the conversion would be lossy. The assets plug-in is not affected by the dithering settings in Photoshop's "Color Settings" dialog (under the "Edit" menu). By default, dithering is off. Setting this to true forces it to be on (again, regardless of Photoshop's color settings). (default: false)
interpolation-type: Force Photoshop to use the given interpolation method when scaling pixmaps. If defined, should take the value of one of the INTERPOLATION constants defined in Generator core: nearestNeighbor, bilinear, bicubic, bicubicSmoother, bicubicSharper, bicubicAutomatic, preserveDetailsUpscale or automaticInterpolation. Otherwise, Photoshop's default interpolation is used.
use-psd-smart-object-pixel-scaling: When set to true, force Photoshop to scale PSD smart objects in pixel space. In PS <= 15.0, PSD smart objects were always scaled in pixel space, which led to fuzzy vectors. In PS >= 15.1, PSD smart objects will by default be scaled in a vector-preserving way. This option forces the old behavior. (default: false)
use-pngquant: When set to true, use pngquant for compression of 8-bit PNGs instead of ImageMagick's convert. This only applies to assets with the .png8 tag. (default: true)
base-directory: When set, place all documentname-assets folders inside the specified base-directory path. Note that base-directory should be an absolute path (e.g. /Users/jbrandt/Desktop on Mac). If the path is relative, it will be resolved relative to the system root, which is likely not what the user wants. (And, will likely lead to permission errors.) (default: undefined)
use-flite: Use FLITE transcoder instead of ImageMagick (default: true)
convert-color-space: When set to true, performs a color conversion on the pixels before they are sent to Generator. The color is converted to the working RGB profile (specified for the document in PS). By default (when this setting is false), the "raw" RGB data is sent, which is what is usually desired. (default: false)
icc-profile: String with the ICC color profile to use. If set this overrides the convert-color-space flag. A common value is "sRGB IEC61966-2.1"
embed-icc-profile: When true, fetch the color profile of the PSD and embed it in the output file. Requires use-flite. (default: false)
use-jpg-encoding: Either "optimal" or "precomputed" to override default huffman coding. Requires use-flite. (default: null)
clip-all-images-to-document-bounds: Indicates whether exported assets should get clipped to the document bounds or not (default: true)
clip-all-images-to-artboard-bounds: Indicates whether exported assets should get clipped to the artboard bounds or not (for layers that are inside an artboard) (default: true)
mask-adds-padding: Indicates whether layer and vector masks that are larger than the layer size will increase the output image dimensions to fit the masked area. (default: true)
expand-max-dimensions: Allow slightly larger max dimensions. If false, uses static max dimensions. (default: false)


-----

*/

#include "../pslib/jsui.js"; // now directly includes json2.js
#target photoshop;

// if(app.documents.length)
// {
    Main();
// }

function Main()
{
    JSUI.TOOLNAME = "Generator Config Editor";
    JSUI.TOOLHELP = "";
    JSUI.populateJSON(); // turns autosave ON

    // JSUI.autoSave = true;
    JSUI.DEFAULTEDITTEXTWIDTH = 60;

    // handle project name / structure here

    // var checkboxes = [
    //     [true,  "svg",            "svg-enabled",                        "SVG Enabled"],
    //     [true,  "svgomg",         "svgomg-enabled",                     "SVG OMG Enabled"],
    //     [false, "copycss",        "css-enabled",                        "Enable Copy CSS"],
    //     [false, "smartscale",     "use-smart-scaling",                  "Use Smart Scaling"],
    //     [false, "ancmasks",       "include-ancestor-masks",             "Included Ancestor Masks"],
    //     [false, "dither",         "allow-dither",                       "Allow Dither"],
    //     [false, "usesmartobject", "use-psd-smart-object-pixel-scaling", "Smart Object Pixel Scaling"],
    //     [true,  "pngquant",       "use-pngquant",                       "Use pngquant for PNG-8"],
    //     [false, "convcolorspace", "convert-color-space",                "Color convert pixels"],
    //     [true,  "useflite",       "use-flite",                          "Use FLITE transcoder"],
    //     [false, "embediccprofile","embed-icc-profile",                  "Output ICC profile from PSD"], // use-flite
    //     [true,  "cliptodocbounds","clip-all-images-to-document-bounds", "Exports clipped to doc bounds"],
    //     [true,  "cliptoabbounds", "clip-all-images-to-artboard-bounds", "Exports clipped to artboard"],
    //     [true,  "maskaddspad",    "mask-adds-padding",                  "Masks add padding to export"],
    //     [false, "expandmaxdim",   "expand-max-dimensions",              "Allow larger max dimensions"],
    //     // WebP must be last - it's only visible on the Mac
    //     [false, "webp",           "webp-enabled",                       "WebP Enabled"]];

    // interpolation
    // var defaultPSInterpolation = "bicubicAutomatic";
    // <option data-locale="nearestNeighbor" value="nearestNeighbor">Nearest Neighbor</option>
    // <option data-locale="bilinear" value="bilinear">Bilinear</option>
    // <option data-locale="bicubicPlain" value="bicubic">Plain Bicubic</option>
    // <option data-locale="bicubicSmoother" value="bicubicSmoother">Bicubic Smoother</option>
    // <option data-locale="bicubicSharper" value="bicubicSharper">Bicubic Sharper</option>
    // <option data-locale="bicubicAutomatic" value="bicubicAutomatic">Bicubic Automatic</option>
    // <option data-locale="preserveDetailsUpscale" value="preserveDetailsUpscale">Preserve Details Upscale</option>
    // <option data-locale="automaticInterpolation" value="automaticInterpolation">Automatic Interpolation</option>

    // ICC profile
    // <option data-locale="icc-unselected" value="icc-unselected">None</option>

    // JPEG specs
    // <option data-locale="icc-unselected" value="none">None</option>
    // <option data-locale="jpeg-optimal" value="optimal">Optimal</option>
    // <option data-locale="jpeg-precomputed" value="precomputed">Pre-computed</option> 
    


//// from https://github.com/adobe-photoshop/generator-panels

    // Load the Photoshop Event Terminology definitions
    var g_StackScriptFolderPath = app.path + "/"+ localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts") + "/"
    + localize("$$$/private/Exposuremerge/StackScriptOnly=Stack Scripts Only/");
    if (typeof typeNULL == "undefined")
    $.evalFile(g_StackScriptFolderPath + "Terminology.jsx");

    //
    // Utility routines for turning Generator on/off & checking status
    //
    var kgeneratorStatusStr = app.stringIDToTypeID( "generatorStatus" );
    var classPluginPrefs             = app.charIDToTypeID('PlgP');
    var kgeneratorDisabledStr        = app.stringIDToTypeID("generatorDisabled");
    var kgeneratorEnabledStr         = app.stringIDToTypeID("generatorEnabled");
    var kinterpolationMethodStr     = app.stringIDToTypeID("interpolationMethod");


    _prefs = function()
    {
        this.bypassDocumentLocation = true;
        this.baseDirectory = JSUI.isWindows ? "C:\\temp\\"+JSUI.TOOLSPREFSFOLDERNAME+"\\generator" : "/Users/Shared/"+JSUI.TOOLSPREFSFOLDERNAME+"/PhotoshopGenerator";
        this.svg = true;
        this.svgomg = true;
        this.copycss = false;
        this.smartscale = false;
        this.ancmasks = false;
        this.dither = false;
        this.usesmartobject = false;
        this.pngquant = true;
        this.convcolorspace = false;
        this.useflite = true;
        this.embediccprofile = false;
        this.cliptodocbounds = true;
        this.cliptoabbounds = true;
        this.maskaddspad = true;
        this.expandmaxdim = false;

        this.webp = false;
        this.webplossless = false;

        this.interpolationType = "bicubicAutomatic";
        // this.interpolationTypeStr = "";
        this.colorProfile =  0;
        this.colorProfileStr =  "sRGB IEC61966-2.1";

        // use-jpg-encoding
        this.jpegEncoding = 0;
        // this.jpegEncodingStr = ""

        return this;
    }

    
    // JSON parsing may fail, let's provide fallbacks
    var cfgObj = {};
    var gao = {}

    // first check for existing generator.js file, created by original Generator Configuration panel
    var generatorConfigFile = new File("~/generator.js");
    if(generatorConfigFile.exists)
    {
        //read UI preferences
       // JSUI.PREFS = JSUI.readIniFile( new _prefs(), JSUI.INIFILE);
        JSUI.PREFS = JSUI.readJSONfile( new _prefs(), JSUI.JSONFILE );

        try
        {
            cfgObj = JSON.parse(readConfig().replace("module.exports = ", ""));
            gao = cfgObj["generator-assets"];
        }
        catch(e)
        {
            if($.level) $.writeln("Error parsing generator.js");
        }

        // alert(" base-directory:  " + gao["base-directory"]);

        updatePrefsObj(gao);
    }
    else // use default values
    {
        //read UI preferences
        // JSUI.PREFS = JSUI.readIniFile( new _prefs(), JSUI.INIFILE);
        JSUI.PREFS = JSUI.readJSONfile( new _prefs(), JSUI.JSONFILE );
    }

    // BUILD UI

    var win = new JSUI.createDialog( { title: JSUI.TOOLNAME, orientation: "column", margins: 15, spacing: 10, alignChildren: "right", width: 0, height: 0, debugInfo:false } );

    var header = win.addRow();
    header.addButton( { imgFile: "img/Info_48px.png", url: JSUI.TOOLHELP, helpTip: "See confluence page on " + JSUI.TOOLNAME, width: 400 });

    win.addStaticText( { text: "Photoshop Generator supports the following configuration options:" } );

    var panelFormats = win.addPanel( { label: "Formats", margins: 15, spacing: 5 });
    var svg = panelFormats.addCheckBox("svg", { label: "SVG Enabled", onClickFunction: _writeConfig, helpTip: "svg-enabled: Whether or not to allow experimental creation of SVG assets \n\n(default: true)" });
    var svgomg = panelFormats.addCheckBox("svgomg", { label: "SVG OMG Enabled", onClickFunction: _writeConfig, helpTip: "svgomg-enabled: If true, use the experimental svgObjectModelGenerator library for creation of SVG assets. If false, use the built in JSX implementation. Requires svg-enabled to be set to true. \n\n(default: true)" });

    panelFormats.addDivider();
    // JPEG Encoding
    // use-jpg-encoding":"optimal"
        // // use-jpg-encoding
        // this.jpegEncoding = "";
        // this.jpegEncodingStr = ""
        var jpegEncodingTypesArr = ["none", "optimal", "precomputed"];
        var jpegEncodingTypesStrArr = ["None", "Optimal", "Pre-computed"];
        var jpegEncoding = panelFormats.addDropDownList("jpegEncoding", { list: jpegEncodingTypesStrArr, label:"JPEG Encoding:", onChangedFunction: _writeConfig, specs: { useGroup: true, groupSpecs: { orientation: 'row'}}, helpTip:"use-jpg-encoding: Either \"optimal\" or \"precomputed\" to override default huffman coding. Requires use-flite. \n\n(default: null)"  });

    panelFormats.addDivider();
    // WEBP format
    var webp = panelFormats.addCheckBox("webp", { label: "WebP Enabled", onClickFunction: _writeConfig, helpTip: "webp-enabled: Whether or not to allow experimental creation of WEBP assets \n\n(default: false)"});
    var webplossless = panelFormats.addCheckBox("webplossless", { label: "WebP Lossless", onClickFunction: _writeConfig, helpTip: "webp-lossless: Use lossless compression for webp format \n\n(default: false)" });

                
    var panelMisc = win.addPanel( { label: "Misc", margins: 15, spacing: 5 });
    var copycss = panelMisc.addCheckBox("copycss", { label: "Enable Copy CSS", onClickFunction: _writeConfig, helpTip: "css-enabled: Whether to expose 'Copy Layer CSS To Clipboard' menu option. \n\n(default: false)" });
    var useflite = panelMisc.addCheckBox("useflite", { label: "Use FLITE transcoder", onClickFunction: _writeConfig, helpTip: "use-flite: Use FLITE transcoder instead of ImageMagick \n\n(default: true)" });
        // when FLITE is set to false, deactivate JPEG settings + output ICC profile

    win.addDivider();

    // PNG-8
    var panelPNG8 = win.addPanel( { label: "PNG8", margins: 15, spacing: 5 });
    var dither = panelPNG8.addCheckBox("dither", { label: "Allow Dither", onClickFunction: _writeConfig, helpTip: "allow-dither: Force the use of dithering when converting to 8-bit RGB in cases where the conversion would be lossy. The assets plug-in is not affected by the dithering settings in Photoshop's \"Color Settings\" dialog (under the \"Edit\" menu). By default, dithering is off. Setting this to true forces it to be on (again, regardless of Photoshop's color settings). \n\n(default: false)" });
    var pngquant = panelPNG8.addCheckBox("pngquant", { label: "Use pngquant for PNG-8", onClickFunction: _writeConfig, helpTip: "use-pngquant: When set to true, use pngquant for compression of 8-bit PNGs instead of ImageMagick's convert. This only applies to assets with the .png8 tag. \n\n(default: true)" }); //"Use pngquant for PNG-8"
    
    win.addDivider();



    win.addDivider();

    var panelColor = win.addPanel( { label: "Color", margins: 15, spacing: 5 });
    var convcolorspace = panelColor.addCheckBox("convcolorspace", { label: "Color convert pixels", onClickFunction: _colorProfileUpdate, helpTip: "convert-color-space: When set to true, performs a color conversion on the pixels before they are sent to Generator. The color is converted to the working RGB profile (specified for the document in PS) By default (when this setting is false), the \"raw\" RGB data is sent, which is what is usually desired. \n\n(default: false)"});
    var embediccprofile = panelColor.addCheckBox("embediccprofile", { label: "Output ICC profile from PSD", onClickFunction: _writeConfig, helpTip: "embed-icc-profile: When true, fetch the color profile of the PSD and embed it in the output file. Requires use-flite. \n\n(default: false)" }); //"Output ICC profile from PSD"
    
    // ICC Color Profile
    // When value is NOT None, convcolorspace should be false/grayed-out
    //      convert-color-space: When set to true, performs a color conversion on the pixels before they are sent to Generator. The color is converted to the working RGB profile (specified for the document in PS). By default (when this setting is false), the "raw" RGB data is sent, which is what is usually desired. (default: false)

    var profileListArr = GetColorProfileList();
    var colorProfile = panelColor.addDropDownList("colorProfile", { list: profileListArr, label:"ICC Color Profile:", onChangedFunction: _writeConfig, specs: { useGroup: true, groupSpecs: { orientation: 'row'}, helpTip: "icc-profile: String with the ICC color profile to use. If set this overrides the convert-color-space flag. A common value is \"sRGB IEC61966-2.1\"" }  });

    // "sRGB IEC61966-2.1"
    
    win.addDivider();

    var panelScaling = win.addPanel( { label: "Scaling", margins: 15, spacing: 5 });
    var usesmartobject = panelScaling.addCheckBox("usesmartobject", { label: "Smart Object Pixel Scaling", onClickFunction: _writeConfig, helpTip: "use-psd-smart-object-pixel-scaling: When set to true, force Photoshop to scale PSD smart objects in pixel space. In PS <= 15.0, PSD smart objects were always scaled in pixel space, which led to fuzzy vectors. In PS >= 15.1, PSD smart objects will by default be scaled in a vector-preserving way. This option forces the old behavior. \n\n(default: false)"}); // "Smart Object Pixel Scaling"
    var smartscale = panelScaling.addCheckBox("smartscale", { label: "Use Smart Scaling", onClickFunction: _writeConfig, helpTip: "use-smart-scaling: Use Photoshop's \"smart\" scaling to scale layer, which (confusingly) means that stroke effects (e.g. rounded rect corners) are not scaled. \n\n(default: false)" });
    var expandmaxdim = panelScaling.addCheckBox("expandmaxdim", { label: "Allow larger max dimensions", onClickFunction: _writeConfig, helpTip: "expand-max-dimensions: Allow slightly larger max dimensions. If false, uses static max dimensions. \n\n(default: false)" });
    // expandmaxdim scaling or not...?

        /*
        addDropDownList() stores an index
        This is a usecase where supporting both display strings and values (with matchArray)
         - see internal .strArray examples (JSUI imagegrid)
*/

        // Interpolation
        var interpolationTypesArr = ["nearestNeighbor", "bilinear", "bicubicPlain", "bicubicSmoother", "bicubicSharper", "bicubicAutomatic", "preserveDetailsUpscale", "automaticInterpolation"];
        var interpolationTypesStrArr = ["Nearest Neighbor", "Bilinear", "Plain Bicubic", "Bicubic Smoother", "Bicubic Sharper", "Bicubic Automatic", "Preserve Details Upscale", "Automatic Interpolation"];
        var interpolationType = panelScaling.addDropDownList("interpolationType", { list: interpolationTypesStrArr, label:"Interpolation:", onChangedFunction: _writeConfig, specs: { useGroup: true, groupSpecs: { orientation: 'row'}}, helpTip:"Force Photoshop to use the given interpolation method when scaling pixmaps. If defined, should take the value of one of the INTERPOLATION constants defined in Generator core: nearestNeighbor, bilinear, bicubic, bicubicSmoother, bicubicSharper, bicubicAutomatic, preserveDetailsUpscale or automaticInterpolation. Otherwise, Photoshop's default interpolation is used."  });


    // dimensions
    var panelDimensions = win.addPanel( { label: "Dimensions", margins: 15, spacing: 5 });
    var ancmasks = panelDimensions.addCheckBox("ancmasks", { label: "Include Ancestor Masks", onClickFunction: _writeConfig, helpTip: "include-ancestor-masks: Cause exported layer to be clipped by any ancestor masks that are visible (ancestor meaning any group layers that contain the layer) Also incorporates the ancestor layer styling ie. group fx, blend mode, opacity, etc. \n\n(default: false)" });
    var cliptodocbounds = panelDimensions.addCheckBox("cliptodocbounds", { label: "Clip to document bounds", onClickFunction: _writeConfig, helpTip: "clip-all-images-to-document-bounds: Indicates whether exported assets should get clipped to the document bounds or not \n\n(default: true)"  }); // "Disgard pixel data located outside of document bounds"
    var cliptoabbounds = panelDimensions.addCheckBox("cliptoabbounds", { label: "Clip to artboard", onClickFunction: _writeConfig, helpTip: "clip-all-images-to-artboard-bounds: Indicates whether exported assets should get clipped to the artboard bounds or not (for layers that are inside an artboard) \n\n(default: true)"}); // "Disgard pixel data located outside of artboard"
    var maskaddspad = panelDimensions.addCheckBox("maskaddspad", { label: "Masks add padding to export", onClickFunction: _writeConfig, helpTip: "mask-adds-padding: Indicates whether layer and vector masks that are larger than the layer size will increase the output image dimensions to fit the masked area. \n\n(default: true)" }); // "Include mask pixel data"
    
    win.addDivider();


        // get interpolation from generator.js if available. If not present, use Photoshop's current setting.
        var generatorInterpolation = gao["interpolation-type"];
        var pshopDefaultInterp = DefaultInterpolationMethod();

        var interpolationIsMatch =  _matchArrItem(generatorInterpolation, interpolationTypesArr);


        var interpolationSelection = generatorInterpolation != undefined && generatorInterpolation != "undefined" ? ( interpolationIsMatch ? generatorInterpolation : pshopDefaultInterp) : pshopDefaultInterp;
        // logic error here
        var _generatorMatchesPhotoshopDefault = generatorInterpolation != undefined && generatorInterpolation != "undefined" ? ( interpolationIsMatch ? (generatorInterpolation == pshopDefaultInterp) : false) : false;

//alert("generatorInterpolation: "+ generatorInterpolation+"\npshopDefaultInterp: "+pshopDefaultInterp+"\ninterpolationSelection: "+interpolationSelection+"\n\n_generatorMatchesPhotoshopDefault: " + _generatorMatchesPhotoshopDefault)
        // then when building window, select dropdownlist item based on existing generator.js value
        // if(generatorInterpolation != undefined)
        // {
            for(var i = 0; i < interpolationTypesArr.length; i++)
            {
                if(interpolationSelection == interpolationTypesArr[i])
                {
                    if(interpolationType != null) interpolationType.items[i].selected = true; 
                    JSUI.PREFS.interpolationType = interpolationTypesArr[i]; 
                    break;
                }
            }

        // on change
		// resamplingMethodDropDownList.onChange = function()
		// {
		// 	for(var i = 0; i < resampleMethods.length; i++)
		// 	{
		// 		if(i == parseInt(this.selection))
		// 		{
		// 			JSUI.PREFS.resample = resampleMethods[i]; 
		// 			JSUI.debug("resample: " + JSUI.PREFS.resample); 
		// 			break;
		// 		}
		// 	}
		// 	JSUI.saveIniFile();
		// };

    win.addDivider();

    var bypassDocumentLocation = win.addCheckBox("bypassDocumentLocation", { label: "Force export directory", onClickFunction: _writeConfig, helpTip: "base-directory: When set, place all documentname-assets folders inside the specified path. \n\nNote that base-directory should be an absolute path, ie: \nWindows: \"C:\\\\Users\\\\username\\\\Desktop\" \nmacOS: \"/Users/username/Desktop\" \n\nIf the path is relative, it will be resolved relative to the system root, which is likely not what the user wants and will likely lead to permission errors. \n\n(default: undefined)"}); //"Photoshop Generator saves assets in a folder next to the original document. This option allows you to define a fixed location instead."
    // win.addStaticText( { label: "Force export directory:"})
    var baseDirectory = win.addBrowseForFolder( "baseDirectory", { characters: 30, onChangingFunction: _writeConfig} );




    // add buttons for reverting to previous / default values / load from JS or JSON

    var buttons = win.addRow( { spacing: 20 } );
    // var no = buttons.addButton( { label: "Close", name: "cancel", width: 125, height: 44, alignment: "right" });
    buttons.addCloseButton();
    var reset = buttons.addButton( { label: "Default", name: "default", width: 125, height: 44, onClickFunction: _resetToDefault })
    //var yes = buttons.addButton( { label: "Update", name: "ok", width: 125, height: 44, alignment: "left" });

    var urlBtn = buttons.addButton( { label: "Info", url: "https://github.com/adobe-photoshop/generator-assets/wiki/Configuration-Options"});
    // var urlBtn = buttons.addInfoButton( { label: "Info", url: "https://github.com/adobe-photoshop/generator-assets/wiki/Configuration-Options"} );

    if(win.show() == 1) 
    {
        //_writeConfig();
        //JSUI.alert("Settings updated!\nThey will be applied once Photoshop has been restarted.");
    }

    //alert(DefaultInterpolationMethod())
   // alert(GetColorProfileList())
//    alert(IsGeneratorRunning());
// alert("Generator enabled: " + kgeneratorDisabledStr);
//alert(kgeneratorStatusStr)

    //
    // Tools for stopping and re-starting Generator

    function GetApplicationAttr( attr )
    {
        var ref = new ActionReference();
        var desc1 = new ActionDescriptor();
        ref.putProperty( classProperty, attr );
        ref.putEnumerated( classApplication, typeOrdinal, enumTarget );
        desc1.putReference( typeNULL, ref );
        return executeAction( eventGet, desc1, DialogModes.NO );
    }

    function DefaultInterpolationMethod()
    {
        var desc = GetApplicationAttr( kinterpolationMethodStr );
        var v = desc.getEnumerationValue( kinterpolationMethodStr );
        return app.typeIDToStringID( v );
    }

    // Return a list of color profile names corresponding to a given
    // OSCode tag for the ACE_SelectorCode (defined in ACETypes.h)
    // From StackSupport.jsx
    function GetColorProfileList()
    {
        function S(x) { return stringIDToTypeID(x); }
        function osTypeToInt(os)
        {
            var n = 0;
            for (i = 0; i < os.length; i++)
                n |= os.charCodeAt(i) << ((3-i)*8);
            return n;
        }
        var profileTagStr = 'rStd';
        var profileTag = osTypeToInt( profileTagStr );
        var args = new ActionDescriptor();
        ref = new ActionReference();
        ref.putProperty( S("property"), S("colorProfileList") );
        ref.putEnumerated( S("application"), S("ordinal"), profileTag );
        args.putReference( S("null"), ref );
        args.putInteger( S("profile"), profileTag );

        var resultDesc = executeAction( S("get"), args, DialogModes.NO );
        var profileList = resultDesc.getList( S("colorProfileList") );
        var i, profileStrings = ["None"];
        for (i = 0; i < profileList.count; ++i)
            profileStrings.push( profileList.getString(i) );
        
    //	return "[" + profileStrings.join(",") + "]";
        return profileStrings;
    }

    function IsGeneratorRunning()
    {
        var desc = GetApplicationAttr( kgeneratorStatusStr );
        var v = desc.getObjectValue( kgeneratorStatusStr );
        return v.getInteger( kgeneratorStatusStr ) === 1;
    }

    function EnableGenerator( flag )
    {
        if (IsGeneratorRunning() == flag) {
            return;
        }
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putProperty( classProperty, classPluginPrefs );
        ref.putEnumerated( classApplication, typeOrdinal, enumTarget );
        desc.putReference( typeNULL, ref );
        var desc5 = new ActionDescriptor();
        desc5.putBoolean( kgeneratorEnabledStr, flag );
        desc5.putBoolean( kgeneratorDisabledStr, ! flag );
        desc.putObject( keyTo, classPluginPrefs, desc5 );
        executeAction( eventSet, desc, DialogModes.NO );
    }
    
    // provide former state of .js config as arg?
    function _writeConfig()
    {
        // alert(_generatorMatchesPhotoshopDefault)
        // alert(interpolationTypesArr[JSUI.PREFS.interpolationType])

        var jsonStr = 'module.exports = {\n'+
        '\t"generator-assets":\n'+
        '\t{\n'+
        //
        //
            
            //o.pathMatchesSystem = str.toString().match( app.path ) != null;
            // alert("pathMatchesSystem: " + o.pathMatchesSystem + "\n" + str);
            //

        (JSUI.PREFS.bypassDocumentLocation && (new File(JSUI.PREFS.baseDirectory).toString().match( app.path ) == null) ? '\t\t"base-directory":"'+ JSUI.uri2fsname(JSUI.PREFS.baseDirectory).replace(/\\/g, "\\\\") + '",\n' : '') +
            '\t\t"svg-enabled":'+JSUI.PREFS.svg+',\n'+
            '\t\t"svgomg-enabled":'+JSUI.PREFS.svgomg+',\n'+
            '\t\t"css-enabled":'+JSUI.PREFS.copycss+',\n'+
            '\t\t"use-smart-scaling":'+JSUI.PREFS.smartscale+',\n'+
            '\t\t"include-ancestor-masks":'+JSUI.PREFS.ancmasks+',\n'+
            '\t\t"allow-dither":'+JSUI.PREFS.dither+',\n'+
            '\t\t"use-psd-smart-object-pixel-scaling":'+JSUI.PREFS.usesmartobject+',\n'+
            '\t\t"use-pngquant":'+JSUI.PREFS.pngquant+',\n'+

            '\t\t"use-flite":'+JSUI.PREFS.useflite+',\n'+
            '\t\t"embed-icc-profile":'+JSUI.PREFS.embediccprofile+',\n'+
            '\t\t"clip-all-images-to-document-bounds":'+JSUI.PREFS.cliptodocbounds+',\n'+
            '\t\t"clip-all-images-to-artboard-bounds":'+JSUI.PREFS.cliptoabbounds+',\n'+
            '\t\t"mask-adds-padding":'+JSUI.PREFS.maskaddspad+',\n'+
            '\t\t"expand-max-dimensions":'+JSUI.PREFS.expandmaxdim+',\n'+

            //  ( JSUI.PREFS.interpolationType != 0 && JSUI.PREFS.interpolationType != undefined ? 
            ( _generatorMatchesPhotoshopDefault ? 
                //  ('\t\t"interpolation-type":"' + interpolationTypesArr[JSUI.PREFS.interpolationType] +'",\n') : '') +
                '' : ('\t\t"interpolation-type":"' + interpolationTypesArr[JSUI.PREFS.interpolationType] +'",\n')) +
        
        
            // When value is NOT None, Color convert pixels / convcolorspace should be false AND grayed-out
        //      convert-color-space: When set to true, performs a color conversion on the pixels before they are sent to Generator. The color is converted to the working RGB profile (specified for the document in PS). By default (when this setting is false), the "raw" RGB data is sent, which is what is usually desired. (default: false)

            '\t\t"convert-color-space":'+JSUI.PREFS.convcolorspace+',\n'+
            ( JSUI.PREFS.convcolorspace ? ( JSUI.PREFS.colorProfile != undefined ? (profileListArr[JSUI.PREFS.colorProfile] != "None" ? ('\t\t"icc-profile":"' + profileListArr[JSUI.PREFS.colorProfile] +'",\n') : '') : '') : '') +
            ( JSUI.PREFS.jpegEncoding != 0 && JSUI.PREFS.jpegEncoding != undefined ? ('\t\t"use-jpg-encoding":"' + jpegEncodingTypesArr[JSUI.PREFS.jpegEncoding] +'",\n') : '') +
            '\t\t"webp-enabled":'+JSUI.PREFS.webp+',\n'+
            '\t\t"webp-lossless":'+JSUI.PREFS.webplossless+'\n'+ // this one last, without the comma
        '\t}\n'+
    '}';
    // '\t\t"interpolation-type":"bicubicAutomatic"\n'+ 
        JSUI.writeToFile(new File("~/generator.js"), jsonStr);
    };

    function _colorProfileUpdate()
    {
         colorProfile.enabled = JSUI.PREFS.convcolorspace && (JSUI.PREFS.colorProfile != 0);
        _writeConfig();
    }


    function _resetToDefault()
    {
        // empty object forces all to default values
        updatePrefsObj({});
        _writeConfig();

        // alert("Resetting!");
        win.close();
        Main();
    }
}


function readConfig(uri)
{
    var uri = uri ? new File(uri) : new File("~/generator.js");
    var str = JSUI.readFromFile(uri, "UTF-8");

    return str;
};

// add routine to make sure the .js value matches one of the supported interpolations, otherwise fallback to Photoshop's current setting
function _matchArrItem( valueStr, arr)
{
    for(var i = 0; i < arr.length; i++)
    {
        if(valueStr == arr[i])
        {
            return true;
        }
    }
    return false;
}

// clumsy, but necessary because property names include dashes.
function updatePrefsObj(gao)
{
    // alert("JSUI.PREFS.bypassDocumentLocation: " + JSUI.PREFS.bypassDocumentLocation + "\nJSUI.PREFS.baseDirectory: " + JSUI.PREFS.baseDirectory)
    // check for invalid path (null/undefined/spaces can return the app's folder URI)
    // in this case the base-directory SHOULD exist 
    // JSUI.PREFS.baseDirectory = JSUI.PREFS.baseDirectory.toString().match( app.path ) != null ? undefined : JSUI.PREFS.baseDirectory;

    // JSUI.PREFS.bypassDocumentLocation = true;
    if(JSUI.PREFS.bypassDocumentLocation)
    {
      //  alert( "base-directory matches app.path : " + gao["base-directory"].toString().match( app.path ) );
//      this.baseDirectory = JSUI.isWindows ? "C:\\temp\\pslib\\generator" : "/Users/Shared/PhotoshopGenerator";

        JSUI.PREFS.baseDirectory = (gao["base-directory"] != undefined) && (gao["base-directory"].toString().match( app.path ) == null) ? (JSUI.isWindows ? "C:\\temp\\"+JSUI.TOOLSPREFSFOLDERNAME+"\\generator" : "/Users/Shared/"+JSUI.TOOLSPREFSFOLDERNAME+"/PhotoshopGenerator") : gao["base-directory"];
    }
    // else
    // {
    //     JSUI.PREFS.baseDirectory = undefined;
    // }

    JSUI.PREFS.svg = gao["svg-enabled"] != undefined ? gao["svg-enabled"] : true;
    JSUI.PREFS.svgomg = gao["svgomg-enabled"] != undefined ? gao["svgomg-enabled"] : true;
    JSUI.PREFS.copycss = gao["css-enabled"] != undefined ? gao["css-enabled"] : false;
    JSUI.PREFS.smartscale = gao["use-smart-scaling"] != undefined ? gao["use-smart-scaling"] : false;
    JSUI.PREFS.ancmasks = gao["include-ancestor-masks"] != undefined ? gao["include-ancestor-masks"] : false;
    JSUI.PREFS.dither = gao["allow-dither"] != undefined ? gao["allow-dither"] : false;
    JSUI.PREFS.usesmartobject = gao["use-psd-smart-object-pixel-scaling"] != undefined ? gao["use-psd-smart-object-pixel-scaling"] : false;
    JSUI.PREFS.pngquant = gao["use-pngquant"] != undefined ? gao["use-pngquant"] : true;
    JSUI.PREFS.convcolorspace = gao["convert-color-space"] != undefined ? gao["convert-color-space"] : false;
    JSUI.PREFS.useflite = gao["use-flite"] != undefined ? gao["use-flite"] : true;
    JSUI.PREFS.embediccprofile = gao["embed-icc-profile"] != undefined ? gao["embed-icc-profile"] : false;
    JSUI.PREFS.cliptodocbounds = gao["clip-all-images-to-document-bounds"] != undefined ? gao["clip-all-images-to-document-bounds"] : true;
    JSUI.PREFS.cliptoabbounds = gao["clip-all-images-to-artboard-bounds"] != undefined ? gao["clip-all-images-to-artboard-bounds"] : true;
    JSUI.PREFS.maskaddspad = gao["mask-adds-padding"] != undefined ? gao["mask-adds-padding"] : true;
    JSUI.PREFS.expandmaxdim = gao["expand-max-dimensions"] != undefined ? gao["expand-max-dimensions"] : false;
    JSUI.PREFS.webp = gao["webp-enabled"] != undefined ? gao["webp-enabled"] : false;
    JSUI.PREFS.webplossless = gao["webp-lossless"] != undefined ? gao["webp-lossless"] : false;
    
    if(gao["interpolation-type"] != undefined && gao["interpolation-type"] != "undefined")
    {
        JSUI.PREFS.interpolationType = gao["interpolation-type"];
    }
    else
    {
        JSUI.PREFS.interpolationType = "bicubicAutomatic";
    }

    // JSUI.PREFS.colorProfile = gao["icc-profile"] != undefined ? gao["icc-profile"] : "sRGB IEC61966-2.1";
    // JSUI.PREFS.colorProfile = gao["icc-profile"] != undefined ? gao["icc-profile"] : undefined;

                        // When value is NOT None, convcolorspace should be false/grayed-out
        //      convert-color-space: When set to true, performs a color conversion on the pixels before they are sent to Generator. The color is converted to the working RGB profile (specified for the document in PS). By default (when this setting is false), the "raw" RGB data is sent, which is what is usually desired. (default: false)

        // ( JSUI.PREFS.convcolorspace ? ( JSUI.PREFS.colorProfile != 0 ? ('\t\t"icc-profile":"' + colorProfileStr[JSUI.PREFS.colorProfile] +'",\n') : '') : '') +
        // ( JSUI.PREFS.jpegEncoding != 0 ? ('\t\t"use-jpg-encoding":"' + jpegEncodingTypesArr[JSUI.PREFS.jpegEncoding] +'",\n') : '') +


    // these should only be stored if not default value

//     if ($("#icc-profile")[0].value === "icc-unselected")
//     delete genOpts['generator-assets']['icc-profile'];
    
// if ($("#use-jpg-encoding")[0].value === "none")
//     delete genOpts['generator-assets']['use-jpg-encoding'];
    if(JSUI.PREFS.jpegEncoding != 0)
    {
        JSUI.PREFS.jpegEncoding = gao["use-jpg-encoding"];
    }

    if(JSUI.PREFS.convcolorspace)
    {
        JSUI.PREFS.colorProfile = gao["icc-profile"];
    }
    
}

// function updateUI()
// {
//     //svg.value = JSUI.PREFS.svg

// }


//EnableGenerator( false ); $.sleep(2000); EnableGenerator( true );
//$.writeln("Gen running: " + IsGeneratorRunning () );
//$.writeln("Interp: " + DefaultInterpolationMethod() );
//$.writeln("Profiles: " + GetColorProfileList() );

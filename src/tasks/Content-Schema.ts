// To parse this data:
//
//   import { Convert } from "./file";
//
//   const content = Convert.toContent(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Content {
    Content: ContentClass;
}

export interface ContentClass {
    en: En;
}

export interface En {
    _dev:   boolean;
    config: Config;
    global: Global;
    menu:   Menu;
}

export interface Config {
    coursesuite: string;
    coursename:  string;
    courseid:    string;
    lms:         boolean;
    defaultlang: string;
}

export interface Global {
    _alllocked:             boolean;
    _assessment:            boolean;
    _assessAttempts:        string;
    _accessibility:         Accessibility;
    bookmark:               Bookmark;
    buttons:                Buttons;
    splash:                 Splash;
    help:                   Help;
    resources:              Resources;
    langselect:             LanguageSelect;
    complete:               Complete;
    header:                 Footer;
    homeBtn:                HomeBtn;
    footer:                 Footer;
    _navigation:            string;
    _forceHome:             boolean;
    continueIns:            string;
    continueMobileIns:      string;
    continueVideoIns:       string;
    continueVideoMobileIns: string;
    closeIns:               string;
}

export interface Accessibility {
    splashtitle: string;
    bookmarktitle: string;
    menutitle: string;
    menuprogress: string;
    locked: string;
    complete: string;
    incomplete: string;
    helptitle: string;
    resourcetitle: string;
    completetitle: string;
    langselecttitle: string;
    menubtn: string;
    next: string;
    containsmedia: string;
    videotitle: string;
    audiotitle: string;
    transcripttitle: string;
}

export interface Bookmark {
    message: string;
    yes:     string;
    no:      string;
}

export interface Buttons {
    continue: string;
    submit:   string;
    close:    string;
}

export interface Complete {
    body: string;
}

export interface Footer {
    _display:    boolean;
    _background: string;
    _colour:     string;
    _logo?:      boolean;
}

export interface Help {
    title:  string;
    body:   string;
    _icons: Icon[];
}

export interface LanguageSelect {
    title:  string;
    body:   string;
}

export interface Icon {
    _image:  string;
    content: string;
}

export interface HomeBtn {
    _display: boolean;
}

export interface Resources {
    title:        string;
    body:       string;
    _links:       LinkElement[];
}

export interface LinkElement {
    _type:       LinkType;
    title:       string;
    _href?:      string;
    _image?:     string;
    _pos?:       string[];
    _mobilePos?: string[];
}

export enum LinkType {
    ImageLink = "image-link",
    Link = "link",
    Title = "title",
}

export interface Splash {
    _display: boolean;
    _type:    string;
    title:    string;
    ins:      string;
    _images:  Images;
}

export interface Images {
    _small1:     string;
    _small2:     string;
    _small3:     string;
    _characters: string;
}

export interface Menu {
    _type:              string;
    _headerImage:       string;
    _headerImageMobile: string;
    _barColour:         string;
    _rows:              number;
    _colours:           string[];
    _complete:          CompleteClass;
    _pages:             Page[];
}

export interface CompleteClass {
    title:  string;
    text:   string;
    _image: string;
    _link:  CompleteLink;
}

export interface CompleteLink {
    _url:   string;
    _image: string;
}

export interface Page {
    _images?:     Image[];
    _lockedInfo?: string;
}

export interface Image {
    _type:           ImageType;
    _image?:         string;
    _imageHover?:    string;
    _imageComplete?: string;
    _id?:            string;
    text?:           string;
}

export enum ImageType {
    Placeholder = "placeholder",
    Selectable = "selectable",
    Text = "text",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toContent(json: string): Content[] {
        return cast(JSON.parse(json), a(r("Content")));
    }

    public static contentToJson(value: Content[]): string {
        return JSON.stringify(uncast(value, a(r("Content"))), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Content": o([
        { json: "Content", js: "Content", typ: r("ContentClass") },
    ], false),
    "ContentClass": o([
        { json: "en", js: "en", typ: r("En") },
    ], false),
    "En": o([
        { json: "_dev", js: "_dev", typ: true },
        { json: "config", js: "config", typ: r("Config") },
        { json: "global", js: "global", typ: r("Global") },
        { json: "menu", js: "menu", typ: r("Menu") },
    ], false),
    "Config": o([
        { json: "coursesuite", js: "coursesuite", typ: "" },
        { json: "coursename", js: "coursename", typ: "" },
        { json: "courseid", js: "courseid", typ: "" },
        { json: "lms", js: "lms", typ: true },
    ], false),
    "Global": o([
        { json: "_alllocked", js: "_alllocked", typ: true },
        { json: "_assessment", js: "_assessment", typ: true },
        { json: "_assessAttempts", js: "_assessAttempts", typ: 0 },
        { json: "bookmark", js: "bookmark", typ: r("Bookmark") },
        { json: "buttons", js: "buttons", typ: r("Buttons") },
        { json: "splash", js: "splash", typ: r("Splash") },
        { json: "help", js: "help", typ: r("Help") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "complete", js: "complete", typ: r("Complete") },
        { json: "header", js: "header", typ: r("Footer") },
        { json: "homeBtn", js: "homeBtn", typ: r("HomeBtn") },
        { json: "footer", js: "footer", typ: r("Footer") },
        { json: "_navigation", js: "_navigation", typ: "" },
        { json: "_forceHome", js: "_forceHome", typ: true },
        { json: "continueIns", js: "continueIns", typ: "" },
        { json: "continueMobileIns", js: "continueMobileIns", typ: "" },
        { json: "continueVideoIns", js: "continueVideoIns", typ: "" },
        { json: "continueVideoMobileIns", js: "continueVideoMobileIns", typ: "" },
        { json: "closeIns", js: "closeIns", typ: "" },
    ], false),
    "Bookmark": o([
        { json: "message", js: "message", typ: "" },
        { json: "yes", js: "yes", typ: "" },
        { json: "no", js: "no", typ: "" },
    ], false),
    "Buttons": o([
        { json: "continue", js: "continue", typ: "" },
        { json: "submit", js: "submit", typ: "" },
        { json: "close", js: "close", typ: "" },
    ], false),
    "Complete": o([
        { json: "body", js: "body", typ: "" },
    ], false),
    "Footer": o([
        { json: "_display", js: "_display", typ: true },
        { json: "_background", js: "_background", typ: "" },
        { json: "_colour", js: "_colour", typ: "" },
        { json: "_logo", js: "_logo", typ: u(undefined, true) },
    ], false),
    "Help": o([
        { json: "title", js: "title", typ: "" },
        { json: "body", js: "body", typ: "" },
        { json: "_icons", js: "_icons", typ: a(r("Icon")) },
    ], false),
    "LanguageSelect": o([
        { json: "title", js: "title", typ: "" },
        { json: "body", js: "body", typ: "" },
    ], false),
    "Icon": o([
        { json: "_image", js: "_image", typ: "" },
        { json: "content", js: "content", typ: "" },
    ], false),
    "HomeBtn": o([
        { json: "_display", js: "_display", typ: true },
    ], false),
    "Resources": o([
        { json: "title", js: "title", typ: "" },
        { json: "_image", js: "_image", typ: "" },
        { json: "_mobileimage", js: "_mobileimage", typ: "" },
        { json: "footer", js: "footer", typ: "" },
        { json: "_links", js: "_links", typ: a(r("LinkElement")) },
    ], false),
    "LinkElement": o([
        { json: "_type", js: "_type", typ: r("LinkType") },
        { json: "title", js: "title", typ: "" },
        { json: "_href", js: "_href", typ: u(undefined, "") },
        { json: "_image", js: "_image", typ: u(undefined, "") },
        { json: "_pos", js: "_pos", typ: u(undefined, a("")) },
        { json: "_mobilePos", js: "_mobilePos", typ: u(undefined, a("")) },
    ], false),
    "Splash": o([
        { json: "_display", js: "_display", typ: true },
        { json: "_type", js: "_type", typ: "" },
        { json: "title", js: "title", typ: "" },
        { json: "ins", js: "ins", typ: "" },
        { json: "_images", js: "_images", typ: r("Images") },
    ], false),
    "Images": o([
        { json: "_small1", js: "_small1", typ: "" },
        { json: "_small2", js: "_small2", typ: "" },
        { json: "_small3", js: "_small3", typ: "" },
        { json: "_characters", js: "_characters", typ: "" },
    ], false),
    "Menu": o([
        { json: "_type", js: "_type", typ: "" },
        { json: "_headerImage", js: "_headerImage", typ: "" },
        { json: "_headerImageMobile", js: "_headerImageMobile", typ: "" },
        { json: "_barColour", js: "_barColour", typ: "" },
        { json: "_rows", js: "_rows", typ: 0 },
        { json: "_colours", js: "_colours", typ: a("") },
        { json: "_complete", js: "_complete", typ: r("CompleteClass") },
        { json: "_pages", js: "_pages", typ: a(r("Page")) },
    ], false),
    "CompleteClass": o([
        { json: "title", js: "title", typ: "" },
        { json: "text", js: "text", typ: "" },
        { json: "_image", js: "_image", typ: "" },
        { json: "_link", js: "_link", typ: r("CompleteLink") },
    ], false),
    "CompleteLink": o([
        { json: "_url", js: "_url", typ: "" },
        { json: "_image", js: "_image", typ: "" },
    ], false),
    "Page": o([
        { json: "_images", js: "_images", typ: u(undefined, a(r("Image"))) },
        { json: "_lockedInfo", js: "_lockedInfo", typ: u(undefined, "") },
    ], false),
    "Image": o([
        { json: "_type", js: "_type", typ: r("ImageType") },
        { json: "_image", js: "_image", typ: u(undefined, "") },
        { json: "_imageHover", js: "_imageHover", typ: u(undefined, "") },
        { json: "_imageComplete", js: "_imageComplete", typ: u(undefined, "") },
        { json: "_id", js: "_id", typ: u(undefined, "") },
        { json: "text", js: "text", typ: u(undefined, "") },
    ], false),
    "LinkType": [
        "image-link",
        "link",
        "title",
    ],
    "ImageType": [
        "placeholder",
        "selectable",
        "text",
    ],
};

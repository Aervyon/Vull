import { ExtendedUser, Message, Member, Guild } from "eris";
interface fetchOpts {
    msg?: Message;
    member?: Member | ExtendedUser;
    guildConf?: object;
    guild?: Guild;
    custom?: string;
    user?: Member | ExtendedUser;
}
interface parseOpts {
    msg?: Message;
    member?: Member | ExtendedUser;
    guild?: Guild;
    custom?: string;
    user?: Member | ExtendedUser;
}
export declare class LangClass {
    default: string;
    initiated?: boolean;
    private _default?;
    langs?: object;
    constructor(defaultLang?: string);
    init(): Promise<void>;
    private pickLang;
    parse(snip: string, options?: parseOpts): string;
    fetchSnippet(snippet: string, options?: fetchOpts): String | void;
}
export default LangClass;

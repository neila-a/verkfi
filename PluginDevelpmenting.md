# NXT Format

## Introduction

NXT is a plain HTML only, but it has got some metadata for declare a tool.

## Metadatas

```ts
/**
 * Metadata for your tool.
 */
export interface tool {

    /** 
     * Name of your tool.
     * @example FooBar
     */
    name: string;

    /**
     * Path of your tool.
     * @example foo-bar
     */
    to: Lowercase<string>;

    /**
     * Description of your tool.
     * @example Foo for the bar.
     */
    desc: string;

    /**
     * URL for icon of your tool.
     * @example https://foo.com/bar.png
     */
    icon: string;

    /**
     * Background of your tool.  
     * It will display in HeadBar when user set "color" to true.  
     * It should be uppercase.
     * @example ["000000", "FFFFFF"]
     */
    color: [Hex, Hex];

}
```

Metadatas is in the `<meta>` tag.  
It starts with `nt:`.  
It like this:  

```html
<meta name="nt:name" content="foobar">
<meta name="nt:desc" content="FooBar">
```

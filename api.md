## Constants

<dl>
<dt><a href="#defaultOptions">defaultOptions</a> : <code>decide</code></dt>
<dd><p>defaults to a function always returning true</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#promem">promem(ClassDefinition)</a> ⇒ <code>function</code></dt>
<dd><p>Creates a factory function that produces proxies to instances of a {class} definition, based on</p>
</dd>
</dl>

<a name="defaultOptions"></a>

## defaultOptions : <code>decide</code>
defaults to a function always returning true

**Kind**: global constant  
<a name="promem"></a>

## promem(ClassDefinition) ⇒ <code>function</code>
Creates a factory function that produces proxies to instances of a {class} definition, based on

**Kind**: global function  
**Returns**: <code>function</code> - A factory function to produce proxies to an instance  

| Param | Type | Description |
| --- | --- | --- |
| ClassDefinition |  |  |
| options.decide | <code>function</code> | A function that checks the instance's given {key} and {value} of a property and        returns true, if the property is public or false if private. |
| options.revealIsProxy | <code>boolean</code> | if true it allows external code to ask for {isProxy} which then returns true |
| options.referenceClass | <code>boolean</code> | if true it allows external code to ask for {class} which then returns        the referenced original class definition but never the instance |

<a name="promem..factory"></a>

### promem~factory(...invocationArgs) ⇒ <code>proxy</code>
Creates an instance of the given ClassDefinition

**Kind**: inner method of [<code>promem</code>](#promem)  

| Param | Description |
| --- | --- |
| ...invocationArgs | arguments of arbitrary length, determined by ClassDefinition |


/**
 * Initial Prototype script to autoload React.JS components so that we can simply use the tags when writing html.
 * <Dummy prop="value">
 *     {
 *         "some-json-data": [
 *             "Because not everything",
 *             "fits in a property"
 *         ]
 *     }
 * </Dummy>
 *
 * The script will combine the body json and html attributes to the React component attributes;
 */
/*
 * Placeholder variable to hold all registered element names.
 * Note: Need to find a clear way to do this.
 */
var reactComponents = [];

$(document).ready(function() {
    var elements = {};
    // index all loaded elements as the DOM uses UPPERCASE only and we need to translate them to the actual classname
    $.each(reactComponents, function(index, name) {
        elements[name.toUpperCase()] = name;
    });

    // Find all elements and apply React.JS
    $(Object.keys(elements).join(',').replace(new RegExp(/\./g),'\\.')).each(function(index, element) {
        var attributes = {};
        // List element attributes
        $(element.attributes).each(function() {
            var value = this.nodeValue;
            if ( value[0] == '{' || value[0] == '[' ) {
                value = JSON.parse(value);
            }
            attributes[this.nodeName] = value;
        });
        // Join attributes with body json
        if ( element.childNodes.length > 0 ) {
            if (element.childNodes[0].nodeValue.length > 0) {
                $.extend(attributes, JSON.parse(element.childNodes[0].nodeValue));
            }
        }
        // Insert dummy element container
        var anchor = $('<div></div>');
        anchor.insertAfter(element);

        // Create React.JS component
        React.renderComponent(
            eval(elements[element.nodeName]+'(attributes)'),
            anchor[0]
        );
        // Remove element
        $(element).remove();
    });
});
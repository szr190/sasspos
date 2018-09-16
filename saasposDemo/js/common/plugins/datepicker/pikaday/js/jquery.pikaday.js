/*!
 * Pikaday jQuery ext datapicker
 * @author lzy
 */
(function(jq,pika)
{
    jq && ( jq.fn.pikaday = function() {
        var args = arguments;
        args && args.length || (args = [{}]);
        return this.each(function() {
            var thisPika = jq(this),
                pikaCache = thisPika.data("pikaday");
            if (pikaCache instanceof pika)"string" == typeof args[0] && "function" == typeof pikaCache[args[0]] && pikaCache[args[0]].apply(pikaCache, Array.prototype.slice.call(args, 1));
            else if ("object" == typeof args[0]) {
                var pikaOptions = jq.extend({},
                    args[0]);
                pikaOptions.field = thisPika[0];
                thisPika.data("pikaday", new pika(pikaOptions))
            }
        })
    })

})(jQuery, window.Pikaday);

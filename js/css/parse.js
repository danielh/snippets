// run with spidermonkey

/*
 * Usage: 
 * 1. Merge conf and custom conf for override
 * 2. Parse conf
 * 3. Merge css and custom css
 * 4. Append css to conf
 * 5. Merge appended
 * 6. Custom css!!!

/* original conf 
 * first level of conf is the type, second is key/value to the type
 */
var conf	= {
	default	: {
		color			: 'green',
		'border-color'	: '@default.color',
		'border-width'	: '1px',
		'border'		: [ '@default.border-width', '@default.border-color', 'solid' ]
	}
};


var css 	= {
		'*'		:
		{
			'background-color': 'red',
			color			: 'blue'
		},
		th	:
		{
			color			: '@*.color'
		},
		div		:
		{
			color			: '@default.color',
			border			: '@default.border'
		}
};

var cmp = {};
function parseValue (value, css)
{
	if (value.charAt(0)=='@') {
		var ref		= value.substr(1);
		var expl	= ref.split('.');
		// TODO: check for value
		var i1	= expl[0];
		var i2	= expl[1];
		return (parseRule(css[expl[0]][expl[1]], css));
	} else {
		return value;
	}
}

function parseRule (rule, css)
{
	var rc = '';
	if (typeof(rule.charAt)=='function') {
		rule = [rule];
	}
	rc	= [];
	rule.each (function () {
			rc.push (parseValue(this, css));
		}
	);
	rc = rc.join(' ')
	return rc;
}

function parseCss (css)
{
	var rules = [];
	css.each (function (index, data) {
			sel		= this[0];
			rule = [];
			this.each (function (index) { 
					rule.push (index + ' : ' + parseRule(this, css) + ';');
				}
			);
			rules.push (index + ' {\n' + rule.join('\n') + '\n}');
		}
	);
	print (rules.join("\n"));
}

// START lib 
Object.prototype.each = function (fn, data)
{
	for (i in this) {
		if (this.hasOwnProperty (i)) {
			if (fn.call (this[i], i, data) === false) { return this; }
		}
	}
	return this;
}

Array.prototype.each = function (fn, data)
{
	for (var i=0; i < this.length;i++) {
		if (fn.call (this[i], i, data) === false) { return this; }
	}
	return this;
};

// START program
//parseCss(css);
//parseCss(conf);
var all = {};
conf.each (function (idx) { all[idx] = this; });
css.each (function (idx) { all[idx] = this; });
parseCss(all);

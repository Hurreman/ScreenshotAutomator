/**
 * ScreenshotAutomator
 * Periodically take screenshots of a chosen URL, and only save the screenshot if the two images differ (currently only compares filesize).
 * @author Fredrik "Hurreman" Grääs
 * @todo Add different pre-defined sceen sizes and the ability to set custom screen sizes.
 * @todo Add actual image comparison by using resembles.js or similar.
 */
"use strict";

var webshot 	= require( 'webshot' ),
	fs 			= require( 'fs' ),
	path		= require( 'path' ),
	dateformat 	= require( 'dateformat'),
	args 		= process.argv.slice( 2 ); // Command line arguments. In this order: url, prefix, path

/**
 * ScreenshotAutomator Class
 */
class ScreenshotAutomator {

	/**
	 * Constructor
	 * @param <String> url
	 * @param <String> prefix
	 * @param <Int> interval
	 * @param <String> path
	 */
	constructor( url, prefix, interval, path ) {
		
		this.defaultInterval 	= 10;
		this.defaultPrefix		= 'screenshot';
		this.timer 				= null;
		this.lastScreenshot		= null;

		this.url 		= url;
		this.prefix 	= prefix;
		this.path 		= path;
		this.interval 	= interval;

		/**
		 * An url is required, duh!
		 */
		if( typeof( this.url ) == 'undefined' ) {
			console.log( 'ERROR: No URL defined! Aborting.' );
			return false;			
		}
		
		
		/**
		 * No prefix?
		 */
		if( typeof( this.prefix ) == 'undefined' ) {
			console.log( 'No prefix defined, using ' + this.defaultPrefix + ' instead.' );
			this.prefix = this.defaultPrefix;
		}


		/**
		 * If path is undefined we'll just use "." ( current folder )
		 */
		if( typeof( this.path ) == 'undefined' ) {
			console.log( 'No path set, using "./Screenshots"' );
			this.path = './Screenshots';
		}
		else {
			this.path = path;
		}

		/**
		 * If interval is undefined, we default to the defaultInterval.
		 * The interval is later multiplied by 1000, since setTimeout expects milliseconds
		 */
		if( typeof( this.interval ) == 'undefined' || this.interval > 0 ) {
			console.log( 'No interval set, using default of ' + this.defaultInterval + ' seconds.' );
			this.interval = this.defaultInterval;
		}

		// Create screenshot folder if it doesn't exist
		if ( !fs.existsSync( this.path ) ) {
		    fs.mkdirSync( this.path );
		}

		// Get last screenshot, if any
		this.lastScreenshot = this.getLastScreenshot();

		// Start the timer
		this.takeScreenshot();

	}

	/**
	 * takeScreenshot
	 */
	takeScreenshot() {
		
		var now 		= new Date();
		var nowString 	= dateformat( now, 'yyyy-mm-dd-HH-MM-ss' );
		var filename 	= this.path + '/' + this.prefix + '_' + nowString + '.png';

		var options = {
			windowSize: {
				width: 1680, 
				height: 1240
			},
			shotSize: {
				width: 'window',
				height: 'all'
			}
		};

		webshot( this.url, filename, options, function( err ) {
			
			var filesize = fs.statSync( filename ).filesize;

			if ( typeof( this.lastScreenshot ) == 'undefined' || this.lastScreenshot == null || this.lastScreenshot == false) {
				console.log( 'First screenshot!' );
				this.lastScreenshot = { filename: filename, filesize: filesize };
			}
			else if ( filesize == this.lastScreenshot.filesize ) {
				console.log( 'Same size, removing the new screenshot.' );
				fs.unlink( filename );
			}
			else {
				console.log( 'Difference detected! Saving screenshot.' );
				this.lastScreenshot = { filename: filename, filesize: filesize };
			}

			setTimeout( function() {
				this.takeScreenshot();
			}.bind( this ), ( this.interval * 1000 ) );

		}.bind( this ));
	}


	/**
	 * getLastScreenshot
	 * - Search through the folder defined in "this.path" and return the last modified screenshot, or false if no files were found
	 */
	getLastScreenshot() {
		
		var files = fs.readdirSync( this.path );
		
		var screenshots = files.map( function( file ) {
			return path.join( this.path, file );
		}.bind(this)).filter( function( file ) {
			return ( fs.statSync( file ).isFile() && path.extname( file ) == '.png' );
		}).sort( function( a, b ) {
			return a.filesize < b.filesize;
		});

		if ( typeof( screenshots ) !== 'undefined' && screenshots.length > 0 ) {
			return { filename: screenshots[ 0 ], filesize: fs.statSync( screenshots[ 0 ] ).size };
		}
		else {
			return false;
		}
	}
}

var SA = new ScreenshotAutomator( args[ 0 ], args[ 1 ], args[ 2 ], args[ 3 ] );
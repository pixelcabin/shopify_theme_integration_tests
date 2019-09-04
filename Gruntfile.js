module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-shopify');
  grunt.loadNpmTasks('grunt-zip');

  let credentials = grunt.file.readJSON('credentials.json');
  grunt.initConfig({
    credentials: credentials,

    url: credentials.url,

    shopify: {
      options: {
        api_key: credentials.api_key,
        password: credentials.password,
        url: '<%= url %>',
        theme: credentials.theme_id,
        base: 'shop/',
        disable_growl_notifications: false
      }
    },

    concurrent: {
      upload_css_js: ['watch', 'exec:touch_css_js'],
      upload_assets: ['watch', 'exec:touch_assets'],
      upload_config: ['watch', 'exec:touch_config'],
      upload_layout: ['watch', 'exec:touch_layout'],
      upload_locales: ['watch', 'exec:touch_locales'],
      upload_snippets: ['watch', 'exec:touch_snippets'],
      upload_sections: ['watch', 'exec:touch_sections'],
      upload_templates: ['watch', 'exec:touch_templates'],
      options: {
        logConcurrentOutput: true // must be on to work with grunt watch
      }
    },

    exec: {
      touch_css_js: 'sleep 1 && touch shop/assets/*.css shop/assets/*.js',
      touch_config: 'sleep 1 && touch shop/config/*',
      touch_layout: 'sleep 1 && touch shop/layout/*',
      touch_locales: 'sleep 1 && touch shop/locales/*',
      touch_assets: 'sleep 2 && touch shop/assets/*',
      touch_sections: 'sleep 5 && touch shop/sections/*',
      touch_snippets: 'sleep 5 && touch shop/snippets/*',
      touch_templates: 'sleep 5 && touch shop/templates/*'
    },

    watch: {
      shopify: {
        files: ['shop/**'],
        tasks: ['shopify']
      }
    },

    zip: {
      'long-format': {
        cwd: 'shop/',
        src: ['shop/**/*'],
        dest: `public/theme.zip`
      }
    }
  });

  // REGISTER TASKS
  grunt.registerTask('default', ['shopify']);
};

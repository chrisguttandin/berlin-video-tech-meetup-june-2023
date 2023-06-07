module.exports = {
    default: {
        files: [
            {
                cwd: 'build/berlin-video-tech-meetup-june-2023',
                dest: 'build/berlin-video-tech-meetup-june-2023',
                expand: true,
                src: ['**/*.html']
            }
        ],
        options: {
            caseSensitive: true,
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            minifyCSS: true,
            removeComments: true
        }
    }
};

'use strict';

const fs = require('fs'),
    path = require('path'),
    resemble = require('../../lib/resemble.js');

describe('node-resemble.js', () => {
    const peopleImage = path.resolve(__dirname, './example/People.png'),
        peopleBlackWhiteImage = path.resolve(__dirname, './example/PeopleBW.png'),
        peopleTwoImage = path.resolve(__dirname, './example/People2.png'),
        largeImage = path.resolve(__dirname, './example/LargeImage.png'),
        smallImage = path.resolve(__dirname, './example/SmallImage.png'),
        withAntiAliasing = path.resolve(__dirname, './example/withAntiAliasing.png'),
        withoutAntiAliasing = path.resolve(__dirname, './example/withoutAntiAliasing.png');

    describe('analysis', () => {
        it('should retrieve basic analysis on an image', done => {
            resemble(peopleImage).onComplete(data => {
                expect(data).toEqual({red: 72, green: 79, blue: 84, alpha: 0, brightness: 78, white: 43, black: 0});
                done();
            });
        });
    });

    describe('compareTo', () => {
        describe('defaults', () => {
            it('should successful compare 2 identical images with each other', done => {
                resemble(peopleImage).compareTo(peopleImage)
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('0.00');
                        done();
                    });
            });

            it('should successful compare 2 identical not equally sized images with each other', done => {
                resemble(smallImage).compareTo(largeImage)
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('0.00');
                        done();
                    });
            });

            it('should fail comparing 2 identical images with each other with ignoreNothing enabled', done => {
                resemble(peopleImage).compareTo(peopleImage)
                    .ignoreNothing()
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('0.00');
                        done();
                    });
            });

            it('should fail comparing 2 non identical images with each other', done => {
                resemble(peopleImage).compareTo(peopleTwoImage)
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('8.66');
                        done();
                    });
            });

            it('should fail comparing 2 identical images with each other with ignoreNothing enabled', done => {
                resemble(peopleImage).compareTo(peopleTwoImage)
                    .ignoreNothing()
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('8.66');
                        done();
                    });
            });
        });

        describe('ignoreColors', () => {
            it('should fail comparing 2 non identical images with each other without ignoreColors enabled', done => {
                resemble(peopleImage).compareTo(peopleBlackWhiteImage)
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('23.57');
                        done();
                    });
            });
            it('should succeed comparing 2 non identical images with each other with ignoreColors enabled', done => {
                resemble(peopleImage).compareTo(peopleBlackWhiteImage)
                    .ignoreColors()
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('0.00');
                        done();
                    });
            });
        });

        describe('ignoreAntialiasing', () => {
            it('should fail comparing 2 non identical images with each other without ignoreAntialiasing enabled', done => {
                resemble(withAntiAliasing).compareTo(withoutAntiAliasing)
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('0.58');
                        done();
                    });
            });

            it('should succeed comparing 2 non identical images with each other with ignoreAntialiasing enabled', done => {
                resemble(withAntiAliasing).compareTo(withoutAntiAliasing)
                    .ignoreAntialiasing()
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('0.00');
                        done();
                    });
            });
        });

        describe('ignoreRectangles', () => {
            it('should fail comparing 2 non identical images with each other without ignoreRectangles enabled', done => {
                resemble(peopleImage).compareTo(peopleTwoImage)
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('8.66');
                        done();
                    });
            });
            it('should fail comparing 2 non identical images with each other with ignoreRectangles enabled', done => {
                resemble(peopleImage).compareTo(peopleTwoImage)
                    .ignoreRectangles([{
                        x: 15,
                        y: 15,
                        height: 200,
                        width: 460
                    }, {
                        x: 0,
                        y: 200,
                        height: 300,
                        width: 460
                    }])
                    .onComplete(data => {
                        expect(data.misMatchPercentage).toEqual('0.00');
                        done();
                    });
            });
        });
    });

    describe('outputSettings', () => {
        beforeEach(() => {
            resemble.outputSettings({
                errorColor: {
                    red: 255,
                    green: 0,
                    blue: 255
                },
                errorType: 'movement',
                transparency: 0.3,
                largeImageThreshold: 1200,
                useCrossOrigin: true
            });
        });

        it('should fail comparing 2 identical images with not the same dimensions', done => {
            resemble(largeImage).compareTo(smallImage)
                .onComplete(data => {
                    expect(data.isSameDimensions).toEqual(false);
                    done();
                });
        });

        it('should save a difference when 2 non identical images fail comparing', done => {
            resemble(peopleImage)
                .compareTo(peopleTwoImage)
                .onComplete(data => {
                    const filePath = path.resolve(process.cwd(), '.tmp/diff.png');

                    expect(data.misMatchPercentage).toEqual('8.66');

                    data.getDiffImage().pack().pipe(fs.createWriteStream(filePath));
                    expect(fs.existsSync(filePath)).toBe(true);
                    done();
                });
        });
    });
});

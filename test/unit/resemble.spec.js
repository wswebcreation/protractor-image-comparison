'use strict';

const fs = require('fs'),
    path = require('path'),
    resemble = require('../../lib/resemble.js');

// const data = { isSameDimensions: true,
//     dimensionDifference: { width: 0, height: 0 },
//     misMatchPercentage: '0.00',
//     analysisTime: 31,
//     getDiffImage: [Function]
// };


describe('node-resemble.js', () => {
    const peopleImage = path.resolve(__dirname, './example/People.png'),
        peopleTwoImage = path.resolve(__dirname, './example/People2.png'),
        largeImage = path.resolve(__dirname, './example/LargeImage.png'),
        smallImage = path.resolve(__dirname, './example/SmallImage.png');

    describe('analysis', () => {
        it('should retrieve basic analysis on an image', done => {
            resemble(peopleImage).onComplete(data => {
                expect(data).toEqual({red: 72, green: 79, blue: 84, brightness: 78});
                done();
            });
        });
    });

    describe('compareTo', () => {
        it('should compare 2 images with each other', done => {
            resemble(peopleImage).compareTo(peopleImage)
                .onComplete(data => {
                    expect(data.misMatchPercentage).toEqual('0.00');
                    done();
                });
        });

        it('should fail comparing 2 images with each other', done => {
            resemble(peopleImage).compareTo(peopleTwoImage)
                .onComplete(data => {
                    expect(data.misMatchPercentage).toEqual('8.66');
                    done();
                });
        });

        it('should fail comparing 2 images with each other with ignoreNothing enabled', done => {
            resemble(peopleImage).compareTo(peopleTwoImage)
                .ignoreNothing()
                .onComplete(data => {
                    expect(data.misMatchPercentage).toEqual('8.66');
                    done();
                });
        });

        it('should fail comparing 2 images with each other with ignoreAntialiasing enabled', done => {
            resemble(peopleImage).compareTo(peopleTwoImage)
                .ignoreAntialiasing()
                .onComplete(data => {
                    expect(data.misMatchPercentage).toEqual('5.85');
                    done();
                });
        });

        it('should fail comparing 2 images with each other with ignoreColors enabled', done => {
            resemble(peopleImage).compareTo(peopleTwoImage)
                .ignoreColors()
                .onComplete(data => {
                    expect(data.misMatchPercentage).toEqual('0.93');
                    done();
                });
        });

        it('should fail comparing 2 images with each other with ignoreRectangles enabled', done => {
            resemble(peopleImage).compareTo(peopleTwoImage)
                .ignoreRectangles([{x: 25, y: 75, height: 320, width: 160}])
                .onComplete(data => {
                    expect(data.misMatchPercentage).toEqual('4.17');
                    done();
                });
        });

        it('should fail comparing 2 images with not the same dimensions', done => {
            resemble(largeImage).compareTo(smallImage)
                .onComplete(data => {
                    console.log(data)
                    expect(data.isSameDimensions).toEqual(false);
                    done();
                });
        });
    });

    fdescribe('outputSettings', () => {
        beforeEach(() =>{
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

        it('should ', done => {
            resemble(peopleImage)
                .compareTo(peopleTwoImage)
                .onComplete(data => {
                    data.getDiffImage().pack().pipe(fs.createWriteStream(path.resolve(process.cwd(), 'diff.png')));
                    done();
                });
        });
    });

    // const EXAMPLE_LARGE_IMAGE = path.resolve(__dirname, './example/LargeImage.png'),
    //     EXAMPLE_SMALL_IMAGE = path.resolve(__dirname, './example/SmallImage.png'),
    //     OPTIMISATION_SKIP_STEP = 6,
    //     DEFAULT_LARGE_IMAGE_THRESHOLD = 1200;
    // describe('largeImageThreshold', () => {
    //     describe('when unset', () => {
    //         describe('when ignoreAntialiasing is enabled', () => {
    //             it('skips pixels when a dimension is larger than the default threshold (1200)', done => {
    //                 getLargeImageComparison().ignoreAntialiasing().onComplete(data => {
    //                     expectPixelsToBeSkipped(data.getDiffImage(), OPTIMISATION_SKIP_STEP);
    //                     done();
    //                 });
    //             });
    //
    //             it('does not skip pixels when both dimensions are smaller than the default threshold (1200)', done => {
    //                 getSmallImageComparison().ignoreAntialiasing().onComplete(data => {
    //                     expectPixelsNotToBeSkipped(data.getDiffImage(), OPTIMISATION_SKIP_STEP);
    //                     done();
    //                 });
    //             });
    //         });
    //
    //         describe('when ignoreAntialiasing is disabled', () => {
    //             it('does not skip pixels when a dimension is larger than the default threshold (1200)', done => {
    //                 getLargeImageComparison().onComplete(data => {
    //                     expectPixelsNotToBeSkipped(data.getDiffImage(), OPTIMISATION_SKIP_STEP);
    //                     done();
    //                 });
    //             });
    //
    //             it('does not skip pixels when both dimensions are smaller than the default threshold (1200)', done => {
    //                 getSmallImageComparison().onComplete(data => {
    //                     expectPixelsNotToBeSkipped(data.getDiffImage(), OPTIMISATION_SKIP_STEP);
    //                     done();
    //                 });
    //             });
    //         });
    //     });
    //
    //     describe('when explicitly set', () => {
    //         afterAll(() => {
    //             resemble.outputSettings({largeImageThreshold: DEFAULT_LARGE_IMAGE_THRESHOLD});
    //         });
    //
    //         describe('when ignoreAntialiasing is enabled', () => {
    //             //this fails
    //             it('skips pixels on images with a dimension larger than the given threshold', done => {
    //                 resemble.outputSettings({largeImageThreshold: 999});
    //                 getSmallImageComparison().ignoreAntialiasing().onComplete(data => {
    //                     expectPixelsToBeSkipped(data.getDiffImage(), OPTIMISATION_SKIP_STEP);
    //                     done();
    //                 });
    //             });
    //
    //             it('does not skip pixels on images with a dimension equal to the given threshold', done => {
    //                 resemble.outputSettings({largeImageThreshold: 1000});
    //                 getSmallImageComparison().ignoreAntialiasing().onComplete(data => {
    //                     expectPixelsNotToBeSkipped(data.getDiffImage(), OPTIMISATION_SKIP_STEP);
    //                     done();
    //                 });
    //             });
    //
    //             it('does not skip pixels on images with both dimensions smaller than the given threshold', done => {
    //                 resemble.outputSettings({largeImageThreshold: 1001});
    //                 getSmallImageComparison().ignoreAntialiasing().onComplete(data => {
    //                     expectPixelsNotToBeSkipped(data.getDiffImage(), OPTIMISATION_SKIP_STEP);
    //                     done();
    //                 });
    //             });
    //         });
    //
    //         describe('when ignoreAntialiasing is disabled', () => {
    //             it('does not skip pixels on images with a dimension larger than the given threshold', done => {
    //                 resemble.outputSettings({largeImageThreshold: 999});
    //                 getSmallImageComparison().onComplete(data => {
    //                     expectPixelsNotToBeSkipped(data.getDiffImage(), OPTIMISATION_SKIP_STEP);
    //                     done();
    //                 });
    //             });
    //
    //             it('does not skip pixels on images with a dimension equal to the given threshold', done => {
    //                 resemble.outputSettings({largeImageThreshold: 1000});
    //                 getSmallImageComparison().onComplete(data => {
    //                     expectPixelsNotToBeSkipped(data.getDiffImage(), OPTIMISATION_SKIP_STEP);
    //                     done();
    //                 });
    //             });
    //
    //             it('does not skip pixels on images with both dimensions smaller than the given threshold', done => {
    //                 resemble.outputSettings({largeImageThreshold: 1001});
    //                 getSmallImageComparison().onComplete(data => {
    //                     expectPixelsNotToBeSkipped(data.getDiffImage(), OPTIMISATION_SKIP_STEP);
    //                     done();
    //                 });
    //             });
    //         });
    //     });
    //
    //     describe('when set to a falsy value', () => {
    //         beforeEach(() => {
    //             resemble.outputSettings({largeImageThreshold: 0});
    //         });
    //
    //         afterAll(() => {
    //             resemble.outputSettings({largeImageThreshold: DEFAULT_LARGE_IMAGE_THRESHOLD});
    //         });
    //
    //         describe('when ignoreAntialiasing is enabled', () => {
    //             it('does not skip pixels on images with a dimension larger than the default threshold (1200)', done => {
    //                 getLargeImageComparison().ignoreAntialiasing().onComplete(data => {
    //                     expectPixelsNotToBeSkipped(data.getDiffImage(), OPTIMISATION_SKIP_STEP);
    //                     done();
    //                 });
    //             });
    //
    //             it('does not skip pixels on images with a dimension smaller than the default threshold (1200)', done => {
    //                 getSmallImageComparison().ignoreAntialiasing().onComplete(data => {
    //                     expectPixelsNotToBeSkipped(data.getDiffImage(), OPTIMISATION_SKIP_STEP);
    //                     done();
    //                 });
    //             });
    //         });
    //
    //         describe('when ignoreAntialiasing is disabled', () => {
    //             it('does not skip pixels on images with a dimension larger than the default threshold (1200)', done => {
    //                 getLargeImageComparison().onComplete(data => {
    //                     expectPixelsNotToBeSkipped(data.getDiffImage(), OPTIMISATION_SKIP_STEP);
    //                     done();
    //                 });
    //             });
    //
    //             it('does not skip pixels on images with a dimension smaller than the default threshold (1200)', done => {
    //                 getSmallImageComparison().onComplete(data => {
    //                     expectPixelsNotToBeSkipped(data.getDiffImage(), OPTIMISATION_SKIP_STEP);
    //                     done();
    //                 });
    //             });
    //         });
    //     });
    //
    //     function expectPixelsToBeSkipped(image, step) {
    //         expect(getPixelForLocation(image, 1, step - 1).alpha).not.toBe(0);
    //         expect(getPixelForLocation(image, 1, step).alpha).toBe(0);
    //         expect(getPixelForLocation(image, 1, step + 1).alpha).not.toBe(0);
    //
    //         expect(getPixelForLocation(image, step - 1, 1).alpha).not.toBe(0);
    //         expect(getPixelForLocation(image, step, 1).alpha).toBe(0);
    //         expect(getPixelForLocation(image, step + 1, 1).alpha).not.toBe(0);
    //
    //         expect(getPixelForLocation(image, step, step).alpha).toBe(0);
    //     }
    //
    //     function expectPixelsNotToBeSkipped(image, step) {
    //         expect(getPixelForLocation(image, 1, step).alpha).not.toBe(0);
    //         expect(getPixelForLocation(image, step, 1).alpha).not.toBe(0);
    //         expect(getPixelForLocation(image, step, step).alpha).not.toBe(0);
    //     }
    // });
    //
    // function getLargeImageComparison() {
    //     return resemble(EXAMPLE_LARGE_IMAGE).compareTo(EXAMPLE_LARGE_IMAGE);
    // }
    //
    // function getSmallImageComparison() {
    //     return resemble(EXAMPLE_SMALL_IMAGE).compareTo(EXAMPLE_SMALL_IMAGE);
    // }
    //
    // function getPixelForLocation(image, x, y) {
    //     var index = (image.width * y + x) << 2;
    //     return {
    //         red: image.data[index],
    //         green: image.data[index + 1],
    //         blue: image.data[index + 2],
    //         alpha: image.data[index + 3]
    //     };
    // }
});

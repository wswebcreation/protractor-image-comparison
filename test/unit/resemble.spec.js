'use strict';

const fs = require('fs-extra');
const path = require('path');
const resemble = require('../../lib/resemble.js');

describe('node-resemble.js', () => {
  const peopleImage = path.resolve(__dirname, './example/People.png');
  const peopleBlackWhiteImage = path.resolve(__dirname, './example/PeopleBW.png');
  const peopleTwoImage = path.resolve(__dirname, './example/People2.png');
  const peopleAlphaImage = path.resolve(__dirname, './example/PeopleAlpha.png');
  const largeImage = path.resolve(__dirname, './example/LargeImage.png');
  const smallImage = path.resolve(__dirname, './example/SmallImage.png');
  const withAntiAliasing = path.resolve(__dirname, './example/withAntiAliasing.png');
  const withoutAntiAliasing = path.resolve(__dirname, './example/withoutAntiAliasing.png');
  const ignoreNothingActual = path.resolve(__dirname, './example/ignoreNothingActual.png');
  const ignoreNothingBase = path.resolve(__dirname, './example/ignoreNothingBase.png');

  describe('compareTo', () => {
    describe('defaults', () => {
      it('should successful compare 2 identical images with each other', done => {
        resemble(peopleImage, peopleImage)
          .onComplete(data => {
            expect(data.misMatchPercentage).toEqual('0.00');
            done();
          });
      });

      it('should successful compare 2 identical not equally sized images with each other', done => {
        resemble(smallImage, largeImage)
          .onComplete(data => {
            expect(data.isSameDimensions).toEqual(false);
            expect(data.dimensionDifference).toEqual({ width: -201, height: -201 });
            expect(data.misMatchPercentage).toEqual('0.00');
            expect(data.diffBounds).toEqual({ top: 1201, left: 1201, bottom: 0, right: 0 });
            done();
          });
      });

      it('should fail comparing 2 non identical images with each other', done => {
        resemble(peopleImage, peopleTwoImage)
          .onComplete(data => {
            expect(data.misMatchPercentage).toEqual('8.66');
            done();
          });
      });
    });

    describe('ignoreAlpha', () => {
      it('should fail comparing 2 non identical images with each other without ignoreAlpha enabled', done => {
        resemble(peopleImage, peopleAlphaImage)
          .onComplete(data => {
            expect(data.misMatchPercentage).toEqual('15.28');
            done();
          });
      });

      it('should fail comparing 2 non identical images with each other with ignoreAlpha enabled', done => {
        resemble(peopleImage, peopleAlphaImage, { ignoreAlpha: true })
          .onComplete(data => {
            expect(data.misMatchPercentage).toEqual('14.58');
            done();
          });
      });
    });

    describe('ignoreAntialiasing', () => {
      it('should fail comparing 2 non identical images with each other without ignoreAntialiasing enabled', done => {
        resemble(withAntiAliasing, withoutAntiAliasing, { ignoreAntialiasing: false })
          .onComplete(data => {
            expect(data.misMatchPercentage).toEqual('0.58');
            done();
          });
      });

      it('should succeed comparing 2 non identical images with each other with ignoreAntialiasing enabled', done => {
        resemble(withAntiAliasing, withoutAntiAliasing, { ignoreAntialiasing: true })
          .onComplete(data => {
            expect(data.misMatchPercentage).toEqual('0.00');
            done();
          });
      });
    });

    describe('ignoreColors', () => {
      it('should fail comparing 2 non identical images with each other without ignoreColors enabled', done => {
        resemble(peopleImage, peopleBlackWhiteImage, { ignoreColors: false })
          .onComplete(data => {
            expect(data.misMatchPercentage).toEqual('23.57');
            done();
          });
      });

      it('should succeed comparing 2 non identical images with each other with ignoreColors enabled', done => {
        resemble(peopleImage, peopleBlackWhiteImage, { ignoreColors: true })
          .onComplete(data => {
            expect(data.misMatchPercentage).toEqual('0.00');
            done();
          });
      });
    });

    describe('ignoreLess', () => {

      it('should fail comparing 2 non identical images with each other with ignoreLess enabled', done => {
        resemble(peopleImage, peopleBlackWhiteImage, { ignoreLess: true })
          .onComplete(data => {
            expect(data.misMatchPercentage).toEqual('23.57');
            done();
          });
      });
    });

    describe('ignoreRectangles', () => {
      it('should fail comparing 2 non identical images with each other without ignoreRectangles enabled', done => {
        resemble(peopleImage, peopleTwoImage)
          .onComplete(data => {
            expect(data.misMatchPercentage).toEqual('8.66');
            done();
          });
      });

      it('should fail comparing 2 non identical images with each other with an empty ignoreRectangles object', done => {
        resemble(peopleImage, peopleTwoImage, { ignoreRectangles: [] })
          .onComplete(data => {
            expect(data.misMatchPercentage).toEqual('8.66');
            done();
          });
      });

      it('should succeed comparing 2 non identical images with each other with ignoreRectangles enabled', done => {
        resemble(peopleImage, peopleBlackWhiteImage, {
          // ignoreAntialiasing: true,
          // ignoreColors: true,
          ignoreRectangles: [
            {
              x: 0,
              y: 160,
              height: 235,
              width: 500
            }, {
              x: 190,
              y: 400,
              height: 35,
              width: 135
            }
          ]
        })
          .onComplete(data => {
            expect(data.misMatchPercentage).toEqual('0.00');
            done();
          });
      });
    });

    describe('ignoreTransparentPixel', () => {

      it('should fail comparing 2 non identical images with transparent regions', done => {
        resemble(peopleAlphaImage, peopleTwoImage)
          .onComplete(data => {
            expect(data.misMatchPercentage).toEqual('7.88');
            done();
          });
      });


      it('should succeed comparing 2 non identical images with ignoring transparent regions', done => {
        resemble(peopleAlphaImage, peopleTwoImage, { ignoreTransparentPixel: true })
          .onComplete(data => {
            expect(data.misMatchPercentage).toEqual('0.00');
            done();
          });
      });

      it('should fail comparing 2 non identical images even ignoring transparent regions', done => {
        resemble(peopleAlphaImage, peopleImage, { ignoreTransparentPixel: true })
          .onComplete(data => {
            expect(data.misMatchPercentage).toEqual('7.37');
            done();
          });
      });

    });

    describe('ignoreNothing', () => {

      it('should fail comparing 2 almost identical images', done => {
        resemble(ignoreNothingActual, ignoreNothingBase, {
          ignoreNothing: true,
        })
          .onComplete(data => {
            expect(data.misMatchPercentage).toEqual('4.38');
            done();
          });
      });


      it('should succeed comparing 2 almost identical images', done => {
        resemble(ignoreNothingActual, ignoreNothingBase)
          .onComplete(data => {
            expect(data.misMatchPercentage).toEqual('0.00');
            done();
          });
      });
    });

  });

  describe('outputSettings', () => {
    it('should save a difference when 2 non identical images fail comparing', done => {
      resemble(peopleImage, peopleTwoImage)
        .onComplete(data => {
          const folder = path.resolve(process.cwd(), '.tmp');
          const filePath = path.resolve(process.cwd(), folder, 'diff.png');
          fs.ensureDirSync(folder);

          expect(data.misMatchPercentage).toEqual('8.66');

          data.getDiffImage().pack().pipe(fs.createWriteStream(filePath));
          expect(fs.existsSync(filePath)).toBe(true);
          done();
        });
    });
  });
});

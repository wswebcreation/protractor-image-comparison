'use strict';

const fs = require('fs-extra');
const path = require('path');
const resemble = require('../../lib/compareImages.js');

describe('node-resemble.js', () => {
  const peopleImage = fs.readFileSync(path.resolve(__dirname, './example/People.png'));
  const peopleBlackWhiteImage = fs.readFileSync(path.resolve(__dirname, './example/PeopleBW.png'));
  const peopleTwoImage = fs.readFileSync(path.resolve(__dirname, './example/People2.png'));
  const peopleAlphaImage = fs.readFileSync(path.resolve(__dirname, './example/PeopleAlpha.png'));
  const largeImage = fs.readFileSync(path.resolve(__dirname, './example/LargeImage.png'));
  const smallImage = fs.readFileSync(path.resolve(__dirname, './example/SmallImage.png'));
  const withAntiAliasing = fs.readFileSync(path.resolve(__dirname, './example/withAntiAliasing.png'));
  const withoutAntiAliasing = fs.readFileSync(path.resolve(__dirname, './example/withoutAntiAliasing.png'));
  const ignoreNothingActual = fs.readFileSync(path.resolve(__dirname, './example/ignoreNothingActual.png'));
  const ignoreNothingBase = fs.readFileSync(path.resolve(__dirname, './example/ignoreNothingBase.png'));

  describe('compareTo', () => {
    describe('defaults', () => {
      it('should successful compare 2 identical images with each other', done => {
        resemble(peopleImage, peopleImage)
          .then(data => {
            expect(data.misMatchPercentage).toEqual('0.00');
            done();
          });
      });

      // Not implemented yet
      xit('should successful compare 2 identical not equally sized images with each other', done => {
        resemble(smallImage, largeImage)
          .then(data => {
            expect(data.isSameDimensions).toEqual(false);
            expect(data.dimensionDifference).toEqual({ width: -201, height: -201 });
            expect(data.misMatchPercentage).toEqual('0.00');
            expect(data.diffBounds).toEqual({ top: 1201, left: 1201, bottom: 0, right: 0 });
            done();
          });
      });

      it('should fail comparing 2 non identical images with each other', done => {
        resemble(peopleImage, peopleTwoImage)
          .then(data => {
            expect(data.misMatchPercentage).toEqual('8.66');
            done();
          });
      });
    });

    describe('ignoreAlpha', () => {
      it('should fail comparing 2 non identical images with each other without ignoreAlpha enabled', done => {
        resemble(peopleImage, peopleAlphaImage)
          .then(data => {
            expect(data.misMatchPercentage).toEqual('15.28');
            done();
          });
      });

      it('should fail comparing 2 non identical images with each other with ignoreAlpha enabled', done => {
        resemble(peopleImage, peopleAlphaImage, { ignore:['alpha'] })
          .then(data => {
            expect(data.misMatchPercentage).toEqual('14.65');
            done();
          });
      });
    });

    describe('ignoreAntialiasing', () => {
      it('should fail comparing 2 non identical images with each other without ignoreAntialiasing enabled', done => {
        resemble(withAntiAliasing, withoutAntiAliasing)
          .then(data => {
            expect(data.misMatchPercentage).toEqual('0.58');
            done();
          });
      });

      it('should succeed comparing 2 non identical images with each other with ignoreAntialiasing enabled', done => {
        resemble(withAntiAliasing, withoutAntiAliasing, { ignore: ['antialiasing'] })
          .then(data => {
            expect(data.misMatchPercentage).toEqual('0.00');
            done();
          });
      });
    });

    describe('ignoreColors', () => {
      it('should fail comparing 2 non identical images with each other without ignoreColors enabled', done => {
        resemble(peopleImage, peopleBlackWhiteImage)
          .then(data => {
            expect(data.misMatchPercentage).toEqual('23.57');
            done();
          });
      });

      it('should succeed comparing 2 non identical images with each other with ignoreColors enabled', done => {
        resemble(peopleImage, peopleBlackWhiteImage, { ignore:['colors'] })
          .then(data => {
            expect(data.misMatchPercentage).toEqual('0.00');
            done();
          });
      });
    });

    describe('ignoreLess', () => {

      it('should fail comparing 2 non identical images with each other with ignoreLess enabled', done => {
        resemble(peopleImage, peopleBlackWhiteImage, { ignore:['less'] })
          .then(data => {
            expect(data.misMatchPercentage).toEqual('23.57');
            done();
          });
      });
    });

    describe('ignoreRectangles', () => {
      it('should fail comparing 2 non identical images with each other without ignoreRectangles enabled', done => {
        resemble(peopleImage, peopleTwoImage)
          .then(data => {
            expect(data.misMatchPercentage).toEqual('8.66');
            done();
          });
      });

      it('should fail comparing 2 non identical images with each other with an empty ignoreRectangles object', done => {
        resemble(peopleImage, peopleTwoImage, { ignoreRectangles:[] })
          .then(data => {
            expect(data.misMatchPercentage).toEqual('8.66');
            done();
          });
      });

      it('should succeed comparing 2 non identical images with each other with ignoreRectangles enabled', done => {
        resemble(peopleImage, peopleBlackWhiteImage, {
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
          .then(data => {
            expect(data.misMatchPercentage).toEqual('0.00');
            done();
          });
      });
    });

    describe('ignoreTransparentPixel', () => {

      it('should fail comparing 2 non identical images with transparent regions', done => {
        resemble(peopleAlphaImage, peopleTwoImage)
          .then(data => {
            expect(data.misMatchPercentage).toEqual('7.88');
            done();
          });
      });


      it('should succeed comparing 2 non identical images with ignoring transparent regions', done => {
        resemble(peopleAlphaImage, peopleTwoImage, { ignoreTransparentPixel: true })
          .then(data => {
            expect(data.misMatchPercentage).toEqual('0.00');
            done();
          });
      });

      it('should fail comparing 2 non identical images even ignoring transparent regions', done => {
        resemble(peopleAlphaImage, peopleImage, { ignoreTransparentPixel: true })
          .then(data => {
            expect(data.misMatchPercentage).toEqual('7.37');
            done();
          });
      });

    });

    describe('ignoreNothing', () => {

      it('should fail comparing 2 almost identical images', done => {
        resemble(ignoreNothingActual, ignoreNothingBase, { ignore:['nothing'] })
          .then(data => {
            expect(data.misMatchPercentage).toEqual('4.38');
            done();
          });
      });


      it('should succeed comparing 2 almost identical images', done => {
        resemble(ignoreNothingActual, ignoreNothingBase)
          .then(data => {
            expect(data.misMatchPercentage).toEqual('0.00');
            done();
          });
      });
    });

  });

  describe('outputSettings', () => {
    it('should save a difference when 2 non identical images fail comparing', done => {
      resemble(peopleImage, peopleTwoImage)
        .then(data => {
          const folder = path.resolve(process.cwd(), '.tmp');
          const filePath = path.resolve(process.cwd(), folder, 'diff.png');
          fs.ensureDirSync(folder);

          expect(data.misMatchPercentage).toEqual('8.66');

          fs.writeFileSync(filePath, data.getBuffer());
          expect(fs.existsSync(filePath)).toBe(true);
          done();
        });
    });
  });
});

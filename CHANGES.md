# Things that changed in V3

## Breaking changes
- create a `canvasScreenshot` of an element has been removed
- `saveFullPageScreens` has been renamed to `saveFullPageScreen`
- `nativeWebScreenshot` has been removed from the options. This can only be added/determined from the capabilities

## NEW
- `resizeDimensions` for `saveElement` and `checkElement` will now accept an object in pixels, see below

```
{
  resizeDimensions: {
    left: 10,
    top: 20,
    right: 15,
    bottom: 25,
  }
}
```

- `savePerInstance` for the main options. This will save each screenshot in a subfolder which is named after the desktop `browserName` or if mobile the `deviceName` from the capabilities


## Deprecated
- On `saveElement` and `checkElement` there is an option to add `resizeDimensions`. This was just a n`number`, like this `{resizeDimensions:15}`. This is deprecated, it needs to be an object like this

```
{
  resizeDimensions: {
    left: 10,
    top: 20,
    right: 15,
    bottom: 25,
  }
}
```

# Things that changed in V3

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

## Removed
- create a `canvasScreenshot` has been removed

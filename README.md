<p align="center">
  <a href="http://logz.io">
    <img height="150px" src="https://logz.io/wp-content/uploads/2017/06/new-logzio-logo.png">
  </a>
</p>


# use-mitre-attack
A react hook getting simplified representation of mitre att&ck

## Usage
```javascript
import { useMitreTags } from 'use-mitre-attack';


const MyComponent() {
  const { getTactics, getTechniques } = useMitreTags();

  return (
    <div>
      {getTactics()}
    </div>
  );
}
```

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {navigationTarget} from '../electron/navigation.cjs';

const origin='http://127.0.0.1:3211';
test('desktop permits its existing origin, including /app and landing navigation',()=>{
 for(const path of ['/app','/app?tab=chat#latest','/'])
  assert.deepEqual(navigationTarget(origin+path,origin),{kind:'internal',url:origin+path});
 for(const url of ['http://127.0.0.1:3212/app','http://localhost:3211/app','http://127.0.0.1.evil.test:3211/app'])
  assert.equal(navigationTarget(url,origin),null);
});
test('external navigation permits only credential-free HTTPS URLs',()=>{
 const url='https://github.com/SUNGMYEONGGI/Oh-My-Openpickle';
 assert.deepEqual(navigationTarget(url,origin),{kind:'external',url});
 for(const unsafe of ['javascript:alert(1)','file:///etc/passwd','mailto:hi@example.com','data:text/html,test','http://example.com','https://user:password@example.com','http://user@127.0.0.1:3211/app','not a URL'])
  assert.equal(navigationTarget(unsafe,origin),null);
});
test('display rebrand retains the package and bundle identities used for existing user data',()=>{
 const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
 assert.equal(pkg.name,'pickle-local');
 assert.equal(pkg.productName,undefined);
 assert.equal(pkg.build.appId,'local.pickle.clone');
 assert.equal(pkg.build.productName,'Oh My Picklebot');
});

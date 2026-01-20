const { execSync } = require('child_process');
const Readline = require('readline');

const Primary = '\x1b[38;5;252m';
const Secondary = '\x1b[2m\x1b[37m';
const Tertiary = '\x1b[38;5;167m';
const N̷_A = '\x1b[0m';

console.log(`${Primary}
 █████   █████                                 ███       ███████████                              ████████  █████ █████ 
░░███   ░░███                                 ░░░███    ░░███░░░░░███                            ███░░░░███░░███ ░░███  
 ░███    ░███   ██████  █████ █████             ░░░███   ░███    ░███  ██████    █████   ██████ ░███   ░░░  ░███  ░███ █
 ░███████████  ███░░███░░███ ░░███  ██████████    ░░░███ ░██████████  ░░░░░███  ███░░   ███░░███░█████████  ░███████████
 ░███░░░░░███ ░███████  ░░░█████░  ░░░░░░░░░░      ███░  ░███░░░░░███  ███████ ░░█████ ░███████ ░███░░░░███ ░░░░░░░███░█
 ░███    ░███ ░███░░░    ███░░░███               ███░    ░███    ░███ ███░░███  ░░░░███░███░░░  ░███   ░███       ░███░ 
 █████   █████░░██████  █████ █████            ███░      ███████████ ░░████████ ██████ ░░██████ ░░████████        █████ 
░░░░░   ░░░░░  ░░░░░░  ░░░░░ ░░░░░            ░░░       ░░░░░░░░░░░   ░░░░░░░░ ░░░░░░   ░░░░░░   ░░░░░░░░        ░░░░░  
${N̷_A}`);

const Items = (() => {
  try {
    const Hex = (
      execSync('powershell -noprofile -command "Get-Clipboard -Raw"', {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }) || ''
    ).replace(/[^0-9a-fA-F]/g, '');
    if (!Hex || Hex.length % 2) throw new Tertiary();
    const Base64 = Buffer.from(Hex, 'hex')
      .toString('base64')
      .replace(/[+/=]/g, (M) => ({ '+': '!', '/': '?', '=': '' }[M]));
    return Array.from({ length: 14 }, (_, I) =>
      (Base64.slice(I * 8, I * 8 + 8) || '').padEnd(8, 'A')
    );
  } catch (E) {
    console.error(`${Tertiary}Error!${N̷_A}`);
    return null;
  }
})();

if (!Items) process.exit(1);

console.log(
  Items.map(
    (Item, I) =>
      `${Secondary}[${String(I + 1).padStart(
        2,
        '0'
      )}]${N̷_A} ${Primary}${Item}${N̷_A}`
  ).join('\n') + '\n'
);

const Reader = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const Prompt = () => {
  Reader.question(`${Primary}[1..14]↩ ${N̷_A}`, (Response) => {
    if (!Response.trim()) {
      console.log(`\n${Secondary}Goodbye!${N̷_A}`);
      return Reader.close();
    }
    const Selected = Response.trim()
      .split(/\s+/)
      .map((N) => parseInt(N, 10) - 1)
      .filter((N) => Number.isInteger(N) && N >= 0 && N < Items.length);
    if (!Selected.length) return Prompt();
    if (!Copy(Selected.map((I) => Items[I]).join('\n'))) {
      console.error(`${Tertiary}Error!${N̷_A}`);
      return Prompt();
    }
    Prompt();
  });
};

const Copy = (Text) => {
  try {
    execSync(
      'powershell -noprofile -command "Set-Clipboard -Value ([Console]::In.ReadToEnd())"',
      { input: Text, stdio: ['pipe', 'ignore', 'pipe'] }
    );
    return true;
  } catch (E) {
    console.error(`${Tertiary}error${N̷_A}`);
    return false;
  }
};

Prompt();

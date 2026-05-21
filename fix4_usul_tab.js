const fs = require('fs');
let ut = fs.readFileSync('app/(tabs)/usul.tsx', 'utf8');

const nameMap = `{'rast':'Rast','ussak':'U\u015f\u015fak','hicaz':'Hicaz','huseyni':'H\u00fcseyn\u00ed','saba':'Saba','segah':'Segah','kurd':'Kurd','neva':'Neva','buselik':'Buselik','cargah':'\u00c7argah','nihavend':'Nihavend','kurdilihicazkar':'K\u00fcrdilihicazkar'}`;

ut = ut.replace(
  `          {usul.commonMakams.map((m: string) => (
            <View key={m} style={[styles.tag, { borderColor: usul.color + '55' }]}>
              <Text style={[styles.tagText, { color: usul.color }]}>{m}</Text>
            </View>
          ))}`,
  `          {usul.commonMakams.map((m: string) => {
              const n: Record<string,string> = ${nameMap};
              return (
                <View key={m} style={[styles.tag, { borderColor: usul.color + '55' }]}>
                  <Text style={[styles.tagText, { color: usul.color }]}>{n[m] || m}</Text>
                </View>
              );
            })}`
);

fs.writeFileSync('app/(tabs)/usul.tsx', ut);
console.log('usul tab display names:', ut.includes('n[m]') ? '\u2713' : '\u2717');

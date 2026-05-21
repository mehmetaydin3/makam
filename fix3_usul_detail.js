const fs = require('fs');
let u = fs.readFileSync('app/usul/[id].tsx', 'utf8');

u = u.replace(/\u2190 Back/g, '\u2190 Usul');

const nameMap = `{'rast':'Rast','ussak':'U\u015f\u015fak','hicaz':'Hicaz','huseyni':'H\u00fcseyn\u00ed','saba':'Saba','segah':'Segah','kurd':'Kurd','neva':'Neva','buselik':'Buselik','cargah':'\u00c7argah','nihavend':'Nihavend','kurdilihicazkar':'K\u00fcrdilihicazkar'}`;

u = u.replace(
  `        <View style={styles.tagRow}>
          {usul.commonMakams.map((m) => (
            <TouchableOpacity key={m} style={[styles.tag, { borderColor: usul.color + '55' }]} onPress={() => router.push('/makam/' + m)}>
              <Text style={[styles.tagText, { color: usul.color }]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>`,
  `        <View style={styles.tagRow}>
          {usul.commonMakams.map((m) => {
            const n = ${nameMap};
            return (
              <TouchableOpacity key={m} style={[styles.tag, { borderColor: usul.color + '55' }]} onPress={() => router.push('/makam/' + m)}>
                <Text style={[styles.tagText, { color: usul.color }]}>{n[m] || m}</Text>
              </TouchableOpacity>
            );
          })}
        </View>`
);

fs.writeFileSync('app/usul/[id].tsx', u);
console.log('back button fixed:', !u.includes('\u2190 Back') ? '\u2713' : '\u2717');
console.log('display names fixed:', u.includes('n[m]') ? '\u2713' : '\u2717');

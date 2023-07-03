import { I18N } from '@common/I18N';
import Nzh from "nzh";
export const nzh = new Nzh({
    ch: I18N.get('零一二三四五六七八九'),
    ch_u: I18N.get('个十百千万亿兆京垓姊穰沟涧正载极'),
    ch_f: I18N.get('负'),
    ch_d: I18N.get('点'),
    m_u: I18N.get('元角分厘'),
    m_t: I18N.get('人民币'),
    m_z: I18N.get('正')
});
export default nzh;
// 客户搜索服务 - 使用免费API搜索真实海外企业
// 数据源：OpenStreetMap Nominatim（完全免费，无需注册）

export interface SearchResult {
  key: string
  company_name: string
  country: string
  city: string
  address: string
  phone: string
  website: string
  industry: string
  type: string
  latitude: number
  longitude: number
  raw_data: any
}

// 国家代码映射（用于Nominatim搜索）
const countryMap: Record<string, string> = {
  '美国': 'us',
  '英国': 'gb',
  '德国': 'de',
  '法国': 'fr',
  '意大利': 'it',
  '西班牙': 'es',
  '荷兰': 'nl',
  '比利时': 'be',
  '澳大利亚': 'au',
  '日本': 'jp',
  '韩国': 'kr',
  '印度': 'in',
  '泰国': 'th',
  '越南': 'vn',
  '马来西亚': 'my',
  '印度尼西亚': 'id',
  '菲律宾': 'ph',
  '新加坡': 'sg',
  '阿联酋': 'ae',
  '沙特阿拉伯': 'sa',
  '土耳其': 'tr',
  '巴西': 'br',
  '墨西哥': 'mx',
  '加拿大': 'ca',
  '俄罗斯': 'ru',
  '波兰': 'pl',
  '瑞典': 'se',
  '挪威': 'no',
  '丹麦': 'dk',
  '芬兰': 'fi',
  '瑞士': 'ch',
  '奥地利': 'at',
  '南非': 'za',
  '埃及': 'eg',
  '尼日利亚': 'ng',
  '肯尼亚': 'ke',
  '阿根廷': 'ar',
  '智利': 'cl',
  '哥伦比亚': 'co',
  '秘鲁': 'pe',
  '新西兰': 'nz',
}

// 行业关键词映射（英文搜索词）
const industryKeywords: Record<string, string[]> = {
  '机械设备': ['machinery', 'industrial equipment', 'machine tool', 'manufacturing'],
  '电子科技': ['electronics', 'technology', 'electronic components', 'semiconductor'],
  '家居用品': ['home goods', 'furniture', 'household products', 'home decor'],
  '服装纺织': ['textile', 'garment', 'clothing', 'fashion apparel'],
  '化工产品': ['chemical', 'industrial chemical', 'petrochemical'],
  '建筑材料': ['construction material', 'building material', 'construction supply'],
  '汽车配件': ['auto parts', 'automotive parts', 'car accessories'],
  '食品饮料': ['food beverage', 'food processing', 'food import'],
}

// 通过 OpenStreetMap Nominatim 搜索企业
async function searchNominatim(query: string, countryCode?: string, limit: number = 20): Promise<SearchResult[]> {
  try {
    let url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=${limit}&q=${encodeURIComponent(query)}`
    if (countryCode) {
      url += `&countrycodes=${countryCode}`
    }
    url += '&accept-language=zh,en'

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TradeProspectPro/1.0 (customer-search-tool)',
      },
    })

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`)
    }

    const data = await response.json()

    return data
      .filter((item: any) => {
        // 过滤出企业/商业相关的结果
        const type = item.type || ''
        const category = item.category || ''
        const excludedTypes = ['residential', 'house', 'apartment', 'parking', 'bus_stop', 'tram_stop', 'subway_entrance', 'pedestrian', 'crossing']
        return !excludedTypes.includes(type) && !excludedTypes.includes(category)
      })
      .map((item: any, index: number) => {
        const address = item.address || {}
        const countryName = address.country || ''
        const cityName = address.city || address.town || address.village || address.county || ''

        return {
          key: `nominatim-${index}-${Date.now()}`,
          company_name: item.name || item.display_name?.split(',')[0] || '未知企业',
          country: countryName,
          city: cityName,
          address: item.display_name || '',
          phone: '',
          website: '',
          industry: item.category || '',
          type: item.type || '',
          latitude: item.lat ? parseFloat(item.lat) : 0,
          longitude: item.lon ? parseFloat(item.lon) : 0,
          raw_data: item,
        }
      })
  } catch (error: any) {
    console.error('Nominatim search error:', error)
    throw new Error(`搜索失败: ${error.message}`)
  }
}

// 通过 Overpass API (OpenStreetMap) 搜索商业设施
async function searchOverpass(query: string, countryCode?: string, limit: number = 40): Promise<SearchResult[]> {
  try {
    // 构建Overpass QL查询
    let areaFilter = ''
    if (countryCode) {
      areaFilter = `area["ISO3166-1:alpha2"="${countryCode.toUpperCase()}"]->.searchArea;`
    } else {
      areaFilter = 'area["ISO3166-1:alpha2"="us"]->.searchArea; area["ISO3166-1:alpha2"="gb"]->.searchArea; area["ISO3166-1:alpha2"="de"]->.searchArea; area["ISO3166-1:alpha2"="jp"]->.searchArea;'
    }

    const overpassQuery = `
      [out:json][timeout:25];
      ${areaFilter}
      (
        node["shop"~"wholesale|trade|hardware|tools|electronics"]${countryCode ? '(area.searchArea)' : '(area.searchArea)'};
        way["shop"~"wholesale|trade|hardware|tools|electronics"]${countryCode ? '(area.searchArea)' : '(area.searchArea)'};
        node["office"~"company|trade|import"]${countryCode ? '(area.searchArea)' : '(area.searchArea)'};
        way["office"~"company|trade|import"]${countryCode ? '(area.searchArea)' : '(area.searchArea)'};
        node["industrial"~"factory|warehouse|plant"]${countryCode ? '(area.searchArea)' : '(area.searchArea)'};
      );
      out center ${Math.min(limit, 50)};
    `

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(overpassQuery)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`)
    }

    const data = await response.json()
    const elements = data.elements || []

    return elements.map((item: any, index: number) => {
      const tags = item.tags || {}
      const lat = item.lat || item.center?.lat || 0
      const lon = item.lon || item.center?.lon || 0

      return {
        key: `overpass-${index}-${Date.now()}`,
        company_name: tags.name || tags['name:en'] || `企业 #${index + 1}`,
        country: tags['addr:country'] || '',
        city: tags['addr:city'] || tags['addr:town'] || '',
        address: [tags['addr:street'], tags['addr:housenumber'], tags['addr:city'], tags['addr:country']].filter(Boolean).join(', '),
        phone: tags.phone || tags['contact:phone'] || '',
        website: tags.website || tags['contact:website'] || '',
        industry: tags.shop || tags.office || tags.industrial || '',
        type: tags.shop || tags.office || tags.industrial || 'business',
        latitude: lat,
        longitude: lon,
        raw_data: item,
      }
    })
  } catch (error: any) {
    console.error('Overpass search error:', error)
    throw new Error(`搜索失败: ${error.message}`)
  }
}

// 主搜索函数
export async function searchCustomers(params: {
  keyword: string
  industry?: string
  country?: string
  city?: string
  source?: 'nominatim' | 'overpass' | 'all'
}): Promise<{ results: SearchResult[]; source: string; total: number }> {
  const { keyword, industry, country, city, source = 'all' } = params

  // 构建搜索关键词
  let searchQuery = keyword
  if (industry && industryKeywords[industry]) {
    const industryTerms = industryKeywords[industry]
    searchQuery = `${keyword} ${industryTerms[0]}`
  }
  if (city) {
    searchQuery = `${searchQuery} ${city}`
  }

  const countryCode = country ? countryMap[country] : undefined

  const allResults: SearchResult[] = []
  const sources: string[] = []

  // Nominatim 搜索
  if (source === 'all' || source === 'nominatim') {
    try {
      const nominatimResults = await searchNominatim(searchQuery, countryCode, 20)
      allResults.push(...nominatimResults)
      sources.push('OpenStreetMap')
    } catch (e) {
      console.error('Nominatim search failed:', e)
    }
  }

  // Overpass 搜索
  if (source === 'all' || source === 'overpass') {
    try {
      const overpassResults = await searchOverpass(searchQuery, countryCode, 40)
      // 去重（按公司名称）
      const existingNames = new Set(allResults.map(r => r.company_name))
      const uniqueOverpass = overpassResults.filter(r => !existingNames.has(r.company_name))
      allResults.push(...uniqueOverpass)
      if (uniqueOverpass.length > 0) {
        sources.push('Overpass')
      }
    } catch (e) {
      console.error('Overpass search failed:', e)
    }
  }

  return {
    results: allResults,
    source: sources.join(' + '),
    total: allResults.length,
  }
}

// 获取国家列表
export function getCountryList() {
  return Object.keys(countryMap).map(name => ({
    label: name,
    value: name,
  }))
}

// 获取行业列表
export function getIndustryList() {
  return Object.keys(industryKeywords).map(name => ({
    label: name,
    value: name,
  }))
}

export const operationResults = [
  {
    kind: 'transaction',
    source: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
    fee: '4325',
    counter: '38',
    gas_limit: '3685',
    storage_limit: '40',
    amount: '0',
    destination: 'KT1W2EEjEBknXhvfypCuez9LVCS8P29exWnm',
    parameters: {
      entrypoint: 'approve',
      value: {
        prim: 'Pair',
        args: [
          { string: 'KT1GJtvtNzSpznsoMQT6qsRRHyauDGj3hixy' },
          { int: '20142019451675916285' },
        ],
      },
    },
    metadata: {
      balance_updates: [
        {
          kind: 'contract',
          contract: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          change: '-4325',
          origin: 'block',
        },
        {
          kind: 'freezer',
          category: 'fees',
          delegate: 'tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU',
          cycle: 1,
          change: '4325',
          origin: 'block',
        },
      ],
      operation_result: {
        status: 'applied',
        storage: {
          prim: 'Pair',
          args: [{ int: '16' }, { int: '237220488388660739260044' }],
        },
        big_map_diff: [
          {
            action: 'update',
            big_map: '16',
            key_hash: 'exprtr3iA2ZhFDtnJZDS1nVxJYeXGWw2AWziVAD7DZf7kxsHmNLZBB',
            key: { bytes: '00006b82198cb179e8306c1bedd08f12dc863f328886' },
            value: {
              prim: 'Pair',
              args: [
                [
                  {
                    prim: 'Elt',
                    args: [
                      { bytes: '0154c07f883b2cfd1cb10341d35a76ab08f1be771700' },
                      { int: '20142019451675916285' },
                    ],
                  },
                  {
                    prim: 'Elt',
                    args: [
                      { bytes: '01adfcd555b86ca9a8a92386771b245f5c2291d2a100' },
                      { int: '0' },
                    ],
                  },
                  {
                    prim: 'Elt',
                    args: [
                      { bytes: '01f8218125551c992e0eaed409fec47831cd91a01200' },
                      { int: '0' },
                    ],
                  },
                ],
                { int: '19272019166664506280073' },
              ],
            },
          },
        ],
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
            change: '-10000',
            origin: 'block',
          },
        ],
        consumed_gas: '3585',
        consumed_milligas: '3584776',
        storage_size: '1930',
        paid_storage_size_diff: '40',
        lazy_storage_diff: [
          {
            kind: 'big_map',
            id: '16',
            diff: {
              action: 'update',
              updates: [
                {
                  key_hash:
                    'exprtr3iA2ZhFDtnJZDS1nVxJYeXGWw2AWziVAD7DZf7kxsHmNLZBB',
                  key: {
                    bytes: '00006b82198cb179e8306c1bedd08f12dc863f328886',
                  },
                  value: {
                    prim: 'Pair',
                    args: [
                      [
                        {
                          prim: 'Elt',
                          args: [
                            {
                              bytes:
                                '0154c07f883b2cfd1cb10341d35a76ab08f1be771700',
                            },
                            { int: '20142019451675916285' },
                          ],
                        },
                        {
                          prim: 'Elt',
                          args: [
                            {
                              bytes:
                                '01adfcd555b86ca9a8a92386771b245f5c2291d2a100',
                            },
                            { int: '0' },
                          ],
                        },
                        {
                          prim: 'Elt',
                          args: [
                            {
                              bytes:
                                '01f8218125551c992e0eaed409fec47831cd91a01200',
                            },
                            { int: '0' },
                          ],
                        },
                      ],
                      { int: '19272019166664506280073' },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    kind: 'transaction',
    source: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
    fee: '1551',
    counter: '39',
    gas_limit: '12160',
    storage_limit: '0',
    amount: '0',
    destination: 'KT1GJtvtNzSpznsoMQT6qsRRHyauDGj3hixy',
    parameters: {
      entrypoint: 'tokenToTezPayment',
      value: {
        prim: 'Pair',
        args: [
          {
            prim: 'Pair',
            args: [{ int: '20142019451675916285' }, { int: '14805252' }],
          },
          { string: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb' },
        ],
      },
    },
    metadata: {
      balance_updates: [
        {
          kind: 'contract',
          contract: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          change: '-1551',
          origin: 'block',
        },
        {
          kind: 'freezer',
          category: 'fees',
          delegate: 'tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU',
          cycle: 1,
          change: '1551',
          origin: 'block',
        },
      ],
      operation_result: {
        status: 'applied',
        storage: {
          prim: 'Pair',
          args: [
            { prim: 'Pair', args: [{ int: '35' }, { int: '36' }] },
            {
              prim: 'Pair',
              args: [
                [
                  [
                    [
                      {
                        prim: 'Pair',
                        args: [
                          {
                            prim: 'Pair',
                            args: [
                              {
                                bytes:
                                  '0186231b23484374a889226c626f4b90964aa4d2dc00',
                              },
                              { prim: 'None' },
                            ],
                          },
                          {
                            prim: 'Pair',
                            args: [{ prim: 'None' }, { int: '1669040937' }],
                          },
                        ],
                      },
                      {
                        prim: 'Pair',
                        args: [{ int: '1669040937' }, { int: '37' }],
                      },
                      { int: '1669040937' },
                      { int: '0' },
                    ],
                    {
                      prim: 'Pair',
                      args: [
                        { prim: 'Pair', args: [{ int: '0' }, { int: '0' }] },
                        {
                          prim: 'Pair',
                          args: [{ int: '0' }, { int: '14208389480' }],
                        },
                      ],
                    },
                    {
                      prim: 'Pair',
                      args: [
                        {
                          bytes: '01eb2b4e13b29822118010298f834af74ec56069e200',
                        },
                        { int: '19292161186116182196357' },
                      ],
                    },
                    { int: '0' },
                    { int: '14223194732' },
                  ],
                  {
                    prim: 'Pair',
                    args: [
                      { prim: 'Pair', args: [{ int: '0' }, { int: '38' }] },
                      { prim: 'Pair', args: [{ int: '0' }, { int: '39' }] },
                    ],
                  },
                  { int: '40' },
                  { int: '41' },
                ],
                { int: '42' },
              ],
            },
          ],
        },
        big_map_diff: [],
        consumed_gas: '6209',
        consumed_milligas: '6208546',
        storage_size: '30480',
        lazy_storage_diff: [
          {
            kind: 'big_map',
            id: '42',
            diff: { action: 'update', updates: [] },
          },
          {
            kind: 'big_map',
            id: '41',
            diff: { action: 'update', updates: [] },
          },
          {
            kind: 'big_map',
            id: '40',
            diff: { action: 'update', updates: [] },
          },
          {
            kind: 'big_map',
            id: '39',
            diff: { action: 'update', updates: [] },
          },
          {
            kind: 'big_map',
            id: '38',
            diff: { action: 'update', updates: [] },
          },
          {
            kind: 'big_map',
            id: '37',
            diff: { action: 'update', updates: [] },
          },
          {
            kind: 'big_map',
            id: '36',
            diff: { action: 'update', updates: [] },
          },
          {
            kind: 'big_map',
            id: '35',
            diff: { action: 'update', updates: [] },
          },
        ],
      },
      internal_operation_results: [
        {
          kind: 'transaction',
          source: 'KT1GJtvtNzSpznsoMQT6qsRRHyauDGj3hixy',
          nonce: 1,
          amount: '0',
          destination: 'KT1W2EEjEBknXhvfypCuez9LVCS8P29exWnm',
          parameters: {
            entrypoint: 'transfer',
            value: {
              prim: 'Pair',
              args: [
                { bytes: '00006b82198cb179e8306c1bedd08f12dc863f328886' },
                {
                  prim: 'Pair',
                  args: [
                    { bytes: '0154c07f883b2cfd1cb10341d35a76ab08f1be771700' },
                    { int: '20142019451675916285' },
                  ],
                },
              ],
            },
          },
          result: {
            status: 'applied',
            storage: {
              prim: 'Pair',
              args: [{ int: '16' }, { int: '237220488388660739260044' }],
            },
            big_map_diff: [
              {
                action: 'update',
                big_map: '16',
                key_hash:
                  'exprtr3iA2ZhFDtnJZDS1nVxJYeXGWw2AWziVAD7DZf7kxsHmNLZBB',
                key: { bytes: '00006b82198cb179e8306c1bedd08f12dc863f328886' },
                value: {
                  prim: 'Pair',
                  args: [
                    [
                      {
                        prim: 'Elt',
                        args: [
                          {
                            bytes:
                              '0154c07f883b2cfd1cb10341d35a76ab08f1be771700',
                          },
                          { int: '0' },
                        ],
                      },
                      {
                        prim: 'Elt',
                        args: [
                          {
                            bytes:
                              '01adfcd555b86ca9a8a92386771b245f5c2291d2a100',
                          },
                          { int: '0' },
                        ],
                      },
                      {
                        prim: 'Elt',
                        args: [
                          {
                            bytes:
                              '01f8218125551c992e0eaed409fec47831cd91a01200',
                          },
                          { int: '0' },
                        ],
                      },
                    ],
                    { int: '19251877147212830363788' },
                  ],
                },
              },
              {
                action: 'update',
                big_map: '16',
                key_hash:
                  'expruZ3auwhSyaNGj6pSkc5SYdSiqfkX4D6QFXNJLv3ztfqU7JqDpX',
                key: { bytes: '0154c07f883b2cfd1cb10341d35a76ab08f1be771700' },
                value: {
                  prim: 'Pair',
                  args: [[], { int: '19292161186116182196357' }],
                },
              },
            ],
            consumed_gas: '4431',
            consumed_milligas: '4430587',
            storage_size: '1921',
            lazy_storage_diff: [
              {
                kind: 'big_map',
                id: '16',
                diff: {
                  action: 'update',
                  updates: [
                    {
                      key_hash:
                        'expruZ3auwhSyaNGj6pSkc5SYdSiqfkX4D6QFXNJLv3ztfqU7JqDpX',
                      key: {
                        bytes: '0154c07f883b2cfd1cb10341d35a76ab08f1be771700',
                      },
                      value: {
                        prim: 'Pair',
                        args: [[], { int: '19292161186116182196357' }],
                      },
                    },
                    {
                      key_hash:
                        'exprtr3iA2ZhFDtnJZDS1nVxJYeXGWw2AWziVAD7DZf7kxsHmNLZBB',
                      key: {
                        bytes: '00006b82198cb179e8306c1bedd08f12dc863f328886',
                      },
                      value: {
                        prim: 'Pair',
                        args: [
                          [
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  bytes:
                                    '0154c07f883b2cfd1cb10341d35a76ab08f1be771700',
                                },
                                { int: '0' },
                              ],
                            },
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  bytes:
                                    '01adfcd555b86ca9a8a92386771b245f5c2291d2a100',
                                },
                                { int: '0' },
                              ],
                            },
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  bytes:
                                    '01f8218125551c992e0eaed409fec47831cd91a01200',
                                },
                                { int: '0' },
                              ],
                            },
                          ],
                          { int: '19251877147212830363788' },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          kind: 'transaction',
          source: 'KT1GJtvtNzSpznsoMQT6qsRRHyauDGj3hixy',
          nonce: 0,
          amount: '14805252',
          destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          result: {
            status: 'applied',
            balance_updates: [
              {
                kind: 'contract',
                contract: 'KT1GJtvtNzSpznsoMQT6qsRRHyauDGj3hixy',
                change: '-14805252',
                origin: 'block',
              },
              {
                kind: 'contract',
                contract: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
                change: '14805252',
                origin: 'block',
              },
            ],
            consumed_gas: '1420',
            consumed_milligas: '1420000',
          },
        },
      ],
    },
  },
  {
    kind: 'transaction',
    source: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
    fee: '709',
    counter: '40',
    gas_limit: '3736',
    storage_limit: '0',
    amount: '0',
    destination: 'KT1W2EEjEBknXhvfypCuez9LVCS8P29exWnm',
    parameters: {
      entrypoint: 'approve',
      value: {
        prim: 'Pair',
        args: [
          { string: 'KT1GJtvtNzSpznsoMQT6qsRRHyauDGj3hixy' },
          { int: '0' },
        ],
      },
    },
    metadata: {
      balance_updates: [
        {
          kind: 'contract',
          contract: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          change: '-709',
          origin: 'block',
        },
        {
          kind: 'freezer',
          category: 'fees',
          delegate: 'tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU',
          cycle: 1,
          change: '709',
          origin: 'block',
        },
      ],
      operation_result: {
        status: 'applied',
        storage: {
          prim: 'Pair',
          args: [{ int: '16' }, { int: '237220488388660739260044' }],
        },
        big_map_diff: [
          {
            action: 'update',
            big_map: '16',
            key_hash: 'exprtr3iA2ZhFDtnJZDS1nVxJYeXGWw2AWziVAD7DZf7kxsHmNLZBB',
            key: { bytes: '00006b82198cb179e8306c1bedd08f12dc863f328886' },
            value: {
              prim: 'Pair',
              args: [
                [
                  {
                    prim: 'Elt',
                    args: [
                      { bytes: '0154c07f883b2cfd1cb10341d35a76ab08f1be771700' },
                      { int: '0' },
                    ],
                  },
                  {
                    prim: 'Elt',
                    args: [
                      { bytes: '01adfcd555b86ca9a8a92386771b245f5c2291d2a100' },
                      { int: '0' },
                    ],
                  },
                  {
                    prim: 'Elt',
                    args: [
                      { bytes: '01f8218125551c992e0eaed409fec47831cd91a01200' },
                      { int: '0' },
                    ],
                  },
                ],
                { int: '19251877147212830363788' },
              ],
            },
          },
        ],
        consumed_gas: '3636',
        consumed_milligas: '3635724',
        storage_size: '1921',
        lazy_storage_diff: [
          {
            kind: 'big_map',
            id: '16',
            diff: {
              action: 'update',
              updates: [
                {
                  key_hash:
                    'exprtr3iA2ZhFDtnJZDS1nVxJYeXGWw2AWziVAD7DZf7kxsHmNLZBB',
                  key: {
                    bytes: '00006b82198cb179e8306c1bedd08f12dc863f328886',
                  },
                  value: {
                    prim: 'Pair',
                    args: [
                      [
                        {
                          prim: 'Elt',
                          args: [
                            {
                              bytes:
                                '0154c07f883b2cfd1cb10341d35a76ab08f1be771700',
                            },
                            { int: '0' },
                          ],
                        },
                        {
                          prim: 'Elt',
                          args: [
                            {
                              bytes:
                                '01adfcd555b86ca9a8a92386771b245f5c2291d2a100',
                            },
                            { int: '0' },
                          ],
                        },
                        {
                          prim: 'Elt',
                          args: [
                            {
                              bytes:
                                '01f8218125551c992e0eaed409fec47831cd91a01200',
                            },
                            { int: '0' },
                          ],
                        },
                      ],
                      { int: '19251877147212830363788' },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    kind: 'transaction',
    source: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
    fee: '1363',
    counter: '41',
    gas_limit: '10281',
    storage_limit: '0',
    amount: '14805252',
    destination: 'KT19ZwDsR3u2xVPydzyMeFLdv2asPY8ghRLH',
    parameters: {
      entrypoint: 'tezToTokenPayment',
      value: {
        prim: 'Pair',
        args: [
          { int: '20165054284781913190' },
          { string: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb' },
        ],
      },
    },
    metadata: {
      balance_updates: [
        {
          kind: 'contract',
          contract: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          change: '-1363',
          origin: 'block',
        },
        {
          kind: 'freezer',
          category: 'fees',
          delegate: 'tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU',
          cycle: 1,
          change: '1363',
          origin: 'block',
        },
      ],
      operation_result: {
        status: 'applied',
        storage: {
          prim: 'Pair',
          args: [
            { prim: 'Pair', args: [{ int: '17' }, { int: '18' }] },
            {
              prim: 'Pair',
              args: [
                [
                  [
                    [
                      {
                        prim: 'Pair',
                        args: [
                          {
                            prim: 'Pair',
                            args: [
                              {
                                bytes:
                                  '0186231b23484374a889226c626f4b90964aa4d2dc00',
                              },
                              { prim: 'None' },
                            ],
                          },
                          {
                            prim: 'Pair',
                            args: [{ prim: 'None' }, { int: '1669040916' }],
                          },
                        ],
                      },
                      {
                        prim: 'Pair',
                        args: [{ int: '1669040916' }, { int: '19' }],
                      },
                      { int: '1669040916' },
                      { int: '0' },
                    ],
                    {
                      prim: 'Pair',
                      args: [
                        { prim: 'Pair', args: [{ int: '0' }, { int: '0' }] },
                        {
                          prim: 'Pair',
                          args: [{ int: '0' }, { int: '145431368497' }],
                        },
                      ],
                    },
                    {
                      prim: 'Pair',
                      args: [
                        {
                          bytes: '01eb2b4e13b29822118010298f834af74ec56069e200',
                        },
                        { int: '198656285001046944786709' },
                      ],
                    },
                    { int: '0' },
                    { int: '145416563245' },
                  ],
                  {
                    prim: 'Pair',
                    args: [
                      { prim: 'Pair', args: [{ int: '0' }, { int: '20' }] },
                      { prim: 'Pair', args: [{ int: '0' }, { int: '21' }] },
                    ],
                  },
                  { int: '22' },
                  { int: '23' },
                ],
                { int: '24' },
              ],
            },
          ],
        },
        big_map_diff: [],
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
            change: '-14805252',
            origin: 'block',
          },
          {
            kind: 'contract',
            contract: 'KT19ZwDsR3u2xVPydzyMeFLdv2asPY8ghRLH',
            change: '14805252',
            origin: 'block',
          },
        ],
        consumed_gas: '5752',
        consumed_milligas: '5751751',
        storage_size: '30484',
        lazy_storage_diff: [
          {
            kind: 'big_map',
            id: '24',
            diff: { action: 'update', updates: [] },
          },
          {
            kind: 'big_map',
            id: '23',
            diff: { action: 'update', updates: [] },
          },
          {
            kind: 'big_map',
            id: '22',
            diff: { action: 'update', updates: [] },
          },
          {
            kind: 'big_map',
            id: '21',
            diff: { action: 'update', updates: [] },
          },
          {
            kind: 'big_map',
            id: '20',
            diff: { action: 'update', updates: [] },
          },
          {
            kind: 'big_map',
            id: '19',
            diff: { action: 'update', updates: [] },
          },
          {
            kind: 'big_map',
            id: '18',
            diff: { action: 'update', updates: [] },
          },
          {
            kind: 'big_map',
            id: '17',
            diff: { action: 'update', updates: [] },
          },
        ],
      },
      internal_operation_results: [
        {
          kind: 'transaction',
          source: 'KT19ZwDsR3u2xVPydzyMeFLdv2asPY8ghRLH',
          nonce: 2,
          amount: '0',
          destination: 'KT1W2EEjEBknXhvfypCuez9LVCS8P29exWnm',
          parameters: {
            entrypoint: 'transfer',
            value: {
              prim: 'Pair',
              args: [
                { bytes: '010acfc5642e6c2feb1df4b652995ac8afad074cf100' },
                {
                  prim: 'Pair',
                  args: [
                    { bytes: '00006b82198cb179e8306c1bedd08f12dc863f328886' },
                    { int: '20165054284781913190' },
                  ],
                },
              ],
            },
          },
          result: {
            status: 'applied',
            storage: {
              prim: 'Pair',
              args: [{ int: '16' }, { int: '237220488388660739260044' }],
            },
            big_map_diff: [
              {
                action: 'update',
                big_map: '16',
                key_hash:
                  'exprtr3iA2ZhFDtnJZDS1nVxJYeXGWw2AWziVAD7DZf7kxsHmNLZBB',
                key: { bytes: '00006b82198cb179e8306c1bedd08f12dc863f328886' },
                value: {
                  prim: 'Pair',
                  args: [
                    [
                      {
                        prim: 'Elt',
                        args: [
                          {
                            bytes:
                              '0154c07f883b2cfd1cb10341d35a76ab08f1be771700',
                          },
                          { int: '0' },
                        ],
                      },
                      {
                        prim: 'Elt',
                        args: [
                          {
                            bytes:
                              '01adfcd555b86ca9a8a92386771b245f5c2291d2a100',
                          },
                          { int: '0' },
                        ],
                      },
                      {
                        prim: 'Elt',
                        args: [
                          {
                            bytes:
                              '01f8218125551c992e0eaed409fec47831cd91a01200',
                          },
                          { int: '0' },
                        ],
                      },
                    ],
                    { int: '19272042201497612276978' },
                  ],
                },
              },
              {
                action: 'update',
                big_map: '16',
                key_hash:
                  'exprujgQq2W4zktMX37LNk9ibvZQ2GtrkSxh7uvkp4RJwmrajJYg7S',
                key: { bytes: '010acfc5642e6c2feb1df4b652995ac8afad074cf100' },
                value: {
                  prim: 'Pair',
                  args: [[], { int: '198656285001046944786709' }],
                },
              },
            ],
            consumed_gas: '4430',
            consumed_milligas: '4429054',
            storage_size: '1921',
            lazy_storage_diff: [
              {
                kind: 'big_map',
                id: '16',
                diff: {
                  action: 'update',
                  updates: [
                    {
                      key_hash:
                        'exprujgQq2W4zktMX37LNk9ibvZQ2GtrkSxh7uvkp4RJwmrajJYg7S',
                      key: {
                        bytes: '010acfc5642e6c2feb1df4b652995ac8afad074cf100',
                      },
                      value: {
                        prim: 'Pair',
                        args: [[], { int: '198656285001046944786709' }],
                      },
                    },
                    {
                      key_hash:
                        'exprtr3iA2ZhFDtnJZDS1nVxJYeXGWw2AWziVAD7DZf7kxsHmNLZBB',
                      key: {
                        bytes: '00006b82198cb179e8306c1bedd08f12dc863f328886',
                      },
                      value: {
                        prim: 'Pair',
                        args: [
                          [
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  bytes:
                                    '0154c07f883b2cfd1cb10341d35a76ab08f1be771700',
                                },
                                { int: '0' },
                              ],
                            },
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  bytes:
                                    '01adfcd555b86ca9a8a92386771b245f5c2291d2a100',
                                },
                                { int: '0' },
                              ],
                            },
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  bytes:
                                    '01f8218125551c992e0eaed409fec47831cd91a01200',
                                },
                                { int: '0' },
                              ],
                            },
                          ],
                          { int: '19272042201497612276978' },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
];

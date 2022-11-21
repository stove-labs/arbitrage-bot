export const  operationResults = [
    {
        "kind": "transaction",
        "source": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
        "fee": "3600",
        "counter": "38",
        "gas_limit": "8532",
        "storage_limit": "9",
        "amount": "14789840",
        "destination": "KT1HuAKauGmCrhGgn3TN2DtrV3qfr4RnhxQW",
        "parameters": {
            "entrypoint": "tezToTokenPayment",
            "value": {
                "prim": "Pair",
                "args": [
                    {
                        "int": "20144064496600686097"
                    },
                    {
                        "string": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"
                    }
                ]
            }
        },
        "metadata": {
            "balance_updates": [
                {
                    "kind": "contract",
                    "contract": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
                    "change": "-3600",
                    "origin": "block"
                },
                {
                    "kind": "accumulator",
                    "category": "block fees",
                    "change": "3600",
                    "origin": "block"
                }
            ],
            "operation_result": {
                "status": "applied",
                "storage": {
                    "prim": "Pair",
                    "args": [
                        {
                            "prim": "Pair",
                            "args": [
                                {
                                    "int": "17"
                                },
                                {
                                    "int": "18"
                                }
                            ]
                        },
                        {
                            "prim": "Pair",
                            "args": [
                                [
                                    [
                                        [
                                            {
                                                "prim": "Pair",
                                                "args": [
                                                    {
                                                        "prim": "Pair",
                                                        "args": [
                                                            {
                                                                "bytes": "01f3221d7975958850e68ee766acac60952bc66c1b00"
                                                            },
                                                            {
                                                                "prim": "None"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "prim": "Pair",
                                                        "args": [
                                                            {
                                                                "prim": "None"
                                                            },
                                                            {
                                                                "int": "1669025196"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "prim": "Pair",
                                                "args": [
                                                    {
                                                        "int": "1669025196"
                                                    },
                                                    {
                                                        "int": "19"
                                                    }
                                                ]
                                            },
                                            {
                                                "int": "1669025196"
                                            },
                                            {
                                                "int": "0"
                                            }
                                        ],
                                        {
                                            "prim": "Pair",
                                            "args": [
                                                {
                                                    "prim": "Pair",
                                                    "args": [
                                                        {
                                                            "int": "0"
                                                        },
                                                        {
                                                            "int": "0"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "prim": "Pair",
                                                    "args": [
                                                        {
                                                            "int": "0"
                                                        },
                                                        {
                                                            "int": "145431353085"
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "prim": "Pair",
                                            "args": [
                                                {
                                                    "bytes": "014cc94cb1230013125453932da26d03e1c447f32900"
                                                },
                                                {
                                                    "int": "198656305990375992321521"
                                                }
                                            ]
                                        },
                                        {
                                            "int": "0"
                                        },
                                        {
                                            "int": "145416563245"
                                        }
                                    ],
                                    {
                                        "prim": "Pair",
                                        "args": [
                                            {
                                                "prim": "Pair",
                                                "args": [
                                                    {
                                                        "int": "0"
                                                    },
                                                    {
                                                        "int": "20"
                                                    }
                                                ]
                                            },
                                            {
                                                "prim": "Pair",
                                                "args": [
                                                    {
                                                        "int": "0"
                                                    },
                                                    {
                                                        "int": "21"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "int": "22"
                                    },
                                    {
                                        "int": "23"
                                    }
                                ],
                                {
                                    "int": "24"
                                }
                            ]
                        }
                    ]
                },
                "balance_updates": [
                    {
                        "kind": "contract",
                        "contract": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
                        "change": "-14789840",
                        "origin": "block"
                    },
                    {
                        "kind": "contract",
                        "contract": "KT1HuAKauGmCrhGgn3TN2DtrV3qfr4RnhxQW",
                        "change": "14789840",
                        "origin": "block"
                    }
                ],
                "consumed_gas": "5809",
                "consumed_milligas": "5808420",
                "storage_size": "30316",
                "lazy_storage_diff": [
                    {
                        "kind": "big_map",
                        "id": "24",
                        "diff": {
                            "action": "update",
                            "updates": []
                        }
                    },
                    {
                        "kind": "big_map",
                        "id": "23",
                        "diff": {
                            "action": "update",
                            "updates": []
                        }
                    },
                    {
                        "kind": "big_map",
                        "id": "22",
                        "diff": {
                            "action": "update",
                            "updates": []
                        }
                    },
                    {
                        "kind": "big_map",
                        "id": "21",
                        "diff": {
                            "action": "update",
                            "updates": []
                        }
                    },
                    {
                        "kind": "big_map",
                        "id": "20",
                        "diff": {
                            "action": "update",
                            "updates": []
                        }
                    },
                    {
                        "kind": "big_map",
                        "id": "19",
                        "diff": {
                            "action": "update",
                            "updates": []
                        }
                    },
                    {
                        "kind": "big_map",
                        "id": "18",
                        "diff": {
                            "action": "update",
                            "updates": []
                        }
                    },
                    {
                        "kind": "big_map",
                        "id": "17",
                        "diff": {
                            "action": "update",
                            "updates": []
                        }
                    }
                ]
            },
            "internal_operation_results": [
                {
                    "kind": "transaction",
                    "source": "KT1HuAKauGmCrhGgn3TN2DtrV3qfr4RnhxQW",
                    "nonce": 0,
                    "amount": "0",
                    "destination": "KT1Fan4tFLmqrnYHcYAygNFStjJZRuHtD3LK",
                    "parameters": {
                        "entrypoint": "transfer",
                        "value": {
                            "prim": "Pair",
                            "args": [
                                {
                                    "bytes": "0166339d5de8842e800b24afad2ebdeaee15e75c4d00"
                                },
                                {
                                    "prim": "Pair",
                                    "args": [
                                        {
                                            "bytes": "00006b82198cb179e8306c1bedd08f12dc863f328886"
                                        },
                                        {
                                            "int": "20144064955734378378"
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    "result": {
                        "status": "applied",
                        "storage": {
                            "prim": "Pair",
                            "args": [
                                {
                                    "int": "16"
                                },
                                {
                                    "int": "217948469221996232979971"
                                }
                            ]
                        },
                        "balance_updates": [
                            {
                                "kind": "contract",
                                "contract": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
                                "change": "-2250",
                                "origin": "block"
                            },
                            {
                                "kind": "burned",
                                "category": "storage fees",
                                "change": "2250",
                                "origin": "block"
                            }
                        ],
                        "consumed_gas": "2624",
                        "consumed_milligas": "2623052",
                        "storage_size": "1889",
                        "paid_storage_size_diff": "9",
                        "lazy_storage_diff": [
                            {
                                "kind": "big_map",
                                "id": "16",
                                "diff": {
                                    "action": "update",
                                    "updates": [
                                        {
                                            "key_hash": "exprusMreGPtxeMozemmMUb5YiJAPzoyRNet8wyqEVHQTXZQZzukZF",
                                            "key": {
                                                "bytes": "0166339d5de8842e800b24afad2ebdeaee15e75c4d00"
                                            },
                                            "value": {
                                                "prim": "Pair",
                                                "args": [
                                                    [],
                                                    {
                                                        "int": "198656305990375992321521"
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "key_hash": "exprtr3iA2ZhFDtnJZDS1nVxJYeXGWw2AWziVAD7DZf7kxsHmNLZBB",
                                            "key": {
                                                "bytes": "00006b82198cb179e8306c1bedd08f12dc863f328886"
                                            },
                                            "value": {
                                                "prim": "Pair",
                                                "args": [
                                                    [
                                                        {
                                                            "prim": "Elt",
                                                            "args": [
                                                                {
                                                                    "bytes": "0159fad4532a5c7ee1e393794b6d775eb28197d60900"
                                                                },
                                                                {
                                                                    "int": "0"
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "prim": "Elt",
                                                            "args": [
                                                                {
                                                                    "bytes": "016e9505e533da0e45a7355e9fdc962ba6ab69944a00"
                                                                },
                                                                {
                                                                    "int": "0"
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    {
                                                        "int": "20144064955734378378"
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        "kind": "transaction",
        "source": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
        "fee": "539",
        "counter": "39",
        "gas_limit": "2043",
        "storage_limit": "40",
        "amount": "0",
        "destination": "KT1Fan4tFLmqrnYHcYAygNFStjJZRuHtD3LK",
        "parameters": {
            "entrypoint": "approve",
            "value": {
                "prim": "Pair",
                "args": [
                    {
                        "string": "KT1Unv26ghEmAUSCJrrpJuNkZFbh8441PzDC"
                    },
                    {
                        "int": "20144064496600686097"
                    }
                ]
            }
        },
        "metadata": {
            "balance_updates": [
                {
                    "kind": "contract",
                    "contract": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
                    "change": "-539",
                    "origin": "block"
                },
                {
                    "kind": "accumulator",
                    "category": "block fees",
                    "change": "539",
                    "origin": "block"
                }
            ],
            "operation_result": {
                "status": "applied",
                "storage": {
                    "prim": "Pair",
                    "args": [
                        {
                            "int": "16"
                        },
                        {
                            "int": "217948469221996232979971"
                        }
                    ]
                },
                "balance_updates": [
                    {
                        "kind": "contract",
                        "contract": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
                        "change": "-10000",
                        "origin": "block"
                    },
                    {
                        "kind": "burned",
                        "category": "storage fees",
                        "change": "10000",
                        "origin": "block"
                    }
                ],
                "consumed_gas": "1943",
                "consumed_milligas": "1942098",
                "storage_size": "1929",
                "paid_storage_size_diff": "40",
                "lazy_storage_diff": [
                    {
                        "kind": "big_map",
                        "id": "16",
                        "diff": {
                            "action": "update",
                            "updates": [
                                {
                                    "key_hash": "exprtr3iA2ZhFDtnJZDS1nVxJYeXGWw2AWziVAD7DZf7kxsHmNLZBB",
                                    "key": {
                                        "bytes": "00006b82198cb179e8306c1bedd08f12dc863f328886"
                                    },
                                    "value": {
                                        "prim": "Pair",
                                        "args": [
                                            [
                                                {
                                                    "prim": "Elt",
                                                    "args": [
                                                        {
                                                            "bytes": "0159fad4532a5c7ee1e393794b6d775eb28197d60900"
                                                        },
                                                        {
                                                            "int": "0"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "prim": "Elt",
                                                    "args": [
                                                        {
                                                            "bytes": "016e9505e533da0e45a7355e9fdc962ba6ab69944a00"
                                                        },
                                                        {
                                                            "int": "0"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "prim": "Elt",
                                                    "args": [
                                                        {
                                                            "bytes": "01ddae9074bc21e5c29ac5075ea17b440472e0023800"
                                                        },
                                                        {
                                                            "int": "20144064496600686097"
                                                        }
                                                    ]
                                                }
                                            ],
                                            {
                                                "int": "20144064955734378378"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    },
    {
        "kind": "transaction",
        "source": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
        "fee": "1335",
        "counter": "40",
        "gas_limit": "9996",
        "storage_limit": "0",
        "amount": "0",
        "destination": "KT1Unv26ghEmAUSCJrrpJuNkZFbh8441PzDC",
        "parameters": {
            "entrypoint": "tokenToTezPayment",
            "value": {
                "prim": "Pair",
                "args": [
                    {
                        "prim": "Pair",
                        "args": [
                            {
                                "int": "20144064496600686097"
                            },
                            {
                                "int": "14806753"
                            }
                        ]
                    },
                    {
                        "string": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"
                    }
                ]
            }
        },
        "metadata": {
            "balance_updates": [
                {
                    "kind": "contract",
                    "contract": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
                    "change": "-1335",
                    "origin": "block"
                },
                {
                    "kind": "accumulator",
                    "category": "block fees",
                    "change": "1335",
                    "origin": "block"
                }
            ],
            "operation_result": {
                "status": "applied",
                "storage": {
                    "prim": "Pair",
                    "args": [
                        {
                            "prim": "Pair",
                            "args": [
                                {
                                    "int": "35"
                                },
                                {
                                    "int": "36"
                                }
                            ]
                        },
                        {
                            "prim": "Pair",
                            "args": [
                                [
                                    [
                                        [
                                            {
                                                "prim": "Pair",
                                                "args": [
                                                    {
                                                        "prim": "Pair",
                                                        "args": [
                                                            {
                                                                "bytes": "01f3221d7975958850e68ee766acac60952bc66c1b00"
                                                            },
                                                            {
                                                                "prim": "None"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "prim": "Pair",
                                                        "args": [
                                                            {
                                                                "prim": "None"
                                                            },
                                                            {
                                                                "int": "1669025246"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "prim": "Pair",
                                                "args": [
                                                    {
                                                        "int": "1669025246"
                                                    },
                                                    {
                                                        "int": "37"
                                                    }
                                                ]
                                            },
                                            {
                                                "int": "1669025246"
                                            },
                                            {
                                                "int": "0"
                                            }
                                        ],
                                        {
                                            "prim": "Pair",
                                            "args": [
                                                {
                                                    "prim": "Pair",
                                                    "args": [
                                                        {
                                                            "int": "0"
                                                        },
                                                        {
                                                            "int": "0"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "prim": "Pair",
                                                    "args": [
                                                        {
                                                            "int": "0"
                                                        },
                                                        {
                                                            "int": "14208387979"
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "prim": "Pair",
                                            "args": [
                                                {
                                                    "bytes": "014cc94cb1230013125453932da26d03e1c447f32900"
                                                },
                                                {
                                                    "int": "19292163231161106966169"
                                                }
                                            ]
                                        },
                                        {
                                            "int": "0"
                                        },
                                        {
                                            "int": "14223194732"
                                        }
                                    ],
                                    {
                                        "prim": "Pair",
                                        "args": [
                                            {
                                                "prim": "Pair",
                                                "args": [
                                                    {
                                                        "int": "0"
                                                    },
                                                    {
                                                        "int": "38"
                                                    }
                                                ]
                                            },
                                            {
                                                "prim": "Pair",
                                                "args": [
                                                    {
                                                        "int": "0"
                                                    },
                                                    {
                                                        "int": "39"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "int": "40"
                                    },
                                    {
                                        "int": "41"
                                    }
                                ],
                                {
                                    "int": "42"
                                }
                            ]
                        }
                    ]
                },
                "consumed_gas": "5811",
                "consumed_milligas": "5810404",
                "storage_size": "30312",
                "lazy_storage_diff": [
                    {
                        "kind": "big_map",
                        "id": "42",
                        "diff": {
                            "action": "update",
                            "updates": []
                        }
                    },
                    {
                        "kind": "big_map",
                        "id": "41",
                        "diff": {
                            "action": "update",
                            "updates": []
                        }
                    },
                    {
                        "kind": "big_map",
                        "id": "40",
                        "diff": {
                            "action": "update",
                            "updates": []
                        }
                    },
                    {
                        "kind": "big_map",
                        "id": "39",
                        "diff": {
                            "action": "update",
                            "updates": []
                        }
                    },
                    {
                        "kind": "big_map",
                        "id": "38",
                        "diff": {
                            "action": "update",
                            "updates": []
                        }
                    },
                    {
                        "kind": "big_map",
                        "id": "37",
                        "diff": {
                            "action": "update",
                            "updates": []
                        }
                    },
                    {
                        "kind": "big_map",
                        "id": "36",
                        "diff": {
                            "action": "update",
                            "updates": []
                        }
                    },
                    {
                        "kind": "big_map",
                        "id": "35",
                        "diff": {
                            "action": "update",
                            "updates": []
                        }
                    }
                ]
            },
            "internal_operation_results": [
                {
                    "kind": "transaction",
                    "source": "KT1Unv26ghEmAUSCJrrpJuNkZFbh8441PzDC",
                    "nonce": 2,
                    "amount": "0",
                    "destination": "KT1Fan4tFLmqrnYHcYAygNFStjJZRuHtD3LK",
                    "parameters": {
                        "entrypoint": "transfer",
                        "value": {
                            "prim": "Pair",
                            "args": [
                                {
                                    "bytes": "00006b82198cb179e8306c1bedd08f12dc863f328886"
                                },
                                {
                                    "prim": "Pair",
                                    "args": [
                                        {
                                            "bytes": "01ddae9074bc21e5c29ac5075ea17b440472e0023800"
                                        },
                                        {
                                            "int": "20144064496600686097"
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    "result": {
                        "status": "applied",
                        "storage": {
                            "prim": "Pair",
                            "args": [
                                {
                                    "int": "16"
                                },
                                {
                                    "int": "217948469221996232979971"
                                }
                            ]
                        },
                        "consumed_gas": "2635",
                        "consumed_milligas": "2634828",
                        "storage_size": "1916",
                        "lazy_storage_diff": [
                            {
                                "kind": "big_map",
                                "id": "16",
                                "diff": {
                                    "action": "update",
                                    "updates": [
                                        {
                                            "key_hash": "exprujfEEKFyHqVJWVdGP5DBezgxfFgPMrAKjfZVrw6PzaQ1vKdkaM",
                                            "key": {
                                                "bytes": "01ddae9074bc21e5c29ac5075ea17b440472e0023800"
                                            },
                                            "value": {
                                                "prim": "Pair",
                                                "args": [
                                                    [],
                                                    {
                                                        "int": "19292163231161106966169"
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "key_hash": "exprtr3iA2ZhFDtnJZDS1nVxJYeXGWw2AWziVAD7DZf7kxsHmNLZBB",
                                            "key": {
                                                "bytes": "00006b82198cb179e8306c1bedd08f12dc863f328886"
                                            },
                                            "value": {
                                                "prim": "Pair",
                                                "args": [
                                                    [
                                                        {
                                                            "prim": "Elt",
                                                            "args": [
                                                                {
                                                                    "bytes": "0159fad4532a5c7ee1e393794b6d775eb28197d60900"
                                                                },
                                                                {
                                                                    "int": "0"
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "prim": "Elt",
                                                            "args": [
                                                                {
                                                                    "bytes": "016e9505e533da0e45a7355e9fdc962ba6ab69944a00"
                                                                },
                                                                {
                                                                    "int": "0"
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "prim": "Elt",
                                                            "args": [
                                                                {
                                                                    "bytes": "01ddae9074bc21e5c29ac5075ea17b440472e0023800"
                                                                },
                                                                {
                                                                    "int": "0"
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    {
                                                        "int": "459133692281"
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    "kind": "transaction",
                    "source": "KT1Unv26ghEmAUSCJrrpJuNkZFbh8441PzDC",
                    "nonce": 1,
                    "amount": "14806753",
                    "destination": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
                    "result": {
                        "status": "applied",
                        "balance_updates": [
                            {
                                "kind": "contract",
                                "contract": "KT1Unv26ghEmAUSCJrrpJuNkZFbh8441PzDC",
                                "change": "-14806753",
                                "origin": "block"
                            },
                            {
                                "kind": "contract",
                                "contract": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
                                "change": "14806753",
                                "origin": "block"
                            }
                        ],
                        "consumed_gas": "1450",
                        "consumed_milligas": "1450000"
                    }
                }
            ]
        }
    },
    {
        "kind": "transaction",
        "source": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
        "fee": "539",
        "counter": "41",
        "gas_limit": "2042",
        "storage_limit": "0",
        "amount": "0",
        "destination": "KT1Fan4tFLmqrnYHcYAygNFStjJZRuHtD3LK",
        "parameters": {
            "entrypoint": "approve",
            "value": {
                "prim": "Pair",
                "args": [
                    {
                        "string": "KT1Unv26ghEmAUSCJrrpJuNkZFbh8441PzDC"
                    },
                    {
                        "int": "0"
                    }
                ]
            }
        },
        "metadata": {
            "balance_updates": [
                {
                    "kind": "contract",
                    "contract": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
                    "change": "-539",
                    "origin": "block"
                },
                {
                    "kind": "accumulator",
                    "category": "block fees",
                    "change": "539",
                    "origin": "block"
                }
            ],
            "operation_result": {
                "status": "applied",
                "storage": {
                    "prim": "Pair",
                    "args": [
                        {
                            "int": "16"
                        },
                        {
                            "int": "217948469221996232979971"
                        }
                    ]
                },
                "consumed_gas": "1942",
                "consumed_milligas": "1941068",
                "storage_size": "1916",
                "lazy_storage_diff": [
                    {
                        "kind": "big_map",
                        "id": "16",
                        "diff": {
                            "action": "update",
                            "updates": [
                                {
                                    "key_hash": "exprtr3iA2ZhFDtnJZDS1nVxJYeXGWw2AWziVAD7DZf7kxsHmNLZBB",
                                    "key": {
                                        "bytes": "00006b82198cb179e8306c1bedd08f12dc863f328886"
                                    },
                                    "value": {
                                        "prim": "Pair",
                                        "args": [
                                            [
                                                {
                                                    "prim": "Elt",
                                                    "args": [
                                                        {
                                                            "bytes": "0159fad4532a5c7ee1e393794b6d775eb28197d60900"
                                                        },
                                                        {
                                                            "int": "0"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "prim": "Elt",
                                                    "args": [
                                                        {
                                                            "bytes": "016e9505e533da0e45a7355e9fdc962ba6ab69944a00"
                                                        },
                                                        {
                                                            "int": "0"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "prim": "Elt",
                                                    "args": [
                                                        {
                                                            "bytes": "01ddae9074bc21e5c29ac5075ea17b440472e0023800"
                                                        },
                                                        {
                                                            "int": "0"
                                                        }
                                                    ]
                                                }
                                            ],
                                            {
                                                "int": "459133692281"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    }
]
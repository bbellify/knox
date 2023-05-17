|%
+$  website     @t
+$  username    @t
+$  password    @t
+$  updated     @da
+$  id          @ud  :: TODO: change this to dif type
+$  secret-hash  @t
+$  entry  [=website =username =password =updated]
+$  enty  @ud
+$  setting-key  @tas
+$  setting-val  @t
:: poke action types
+$  action
  $%  [%add =website =username =password]
      [%edit =id =website =username =password]
      [%del =id]
      [%gen =enty]
      [%sett =setting-key =setting-val]
      [%reset-set num=@]
      [%secret =secret-hash]
      :: [%import =vault]
  ==
:: update for json types
+$  update
  $%  [%init =vault =settings]
      [%vault =vault]
      [%enty =enty]
      [%settings =settings]
      action
  ==
:: types for agent state
+$  vault  (map id entry)
+$  settings  (map setting-key setting-val)
--
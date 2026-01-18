import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import MergeStructure from './MergerStructure'
import CompressStructure from './CompressStructure'
import ZipStructure from './ZipStructure'
import { ScrollView } from 'react-native-gesture-handler'
import FileStructure from './FileStructure'

const Tabs = () => {
     const [activeTab, setActiveTab] = useState('Convert');
  return (
    <View style={{ flex: 1 }}>
           <View className="flex-row justify-around items-center border border-gray-800 mt-0 py-4">
        {['Convert', 'Merge', 'Compress', 'Zip'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className="relative px-6"
          >
            <Text className={`text-gray-400 text-lg ${activeTab === tab ? 'text-white font-bold' : ''}`}>
              {tab}
            </Text>
            {activeTab === tab && (
              <View className="absolute bottom-[-15px] left-0 right-0 h-1 bg-red-600" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="mt-6 px-4" showsVerticalScrollIndicator={true}>
        {activeTab === 'Convert' && (
          <>
            <FileStructure fromFormat="jpg" toFormat="png" fileFormat=".png" />
            <FileStructure fromFormat="webp" toFormat="jpg" fileFormat=".jpg" />
            <FileStructure fromFormat="png" toFormat="webp" fileFormat=".webp" />
            <View className="mb-20" />
          </>
        )}

        {activeTab === 'Merge' && (
          <View className="items-center mt-5">
            <Text className="text-white text-lg">
              <MergeStructure />
            </Text>
          </View>
        )}

        {activeTab === 'Compress' && (
          <View className="items-center mt-5">
            <CompressStructure />
          </View>
        )}

        {activeTab === 'Zip' && (
          <View className="items-center mt-5">
            <ZipStructure />
          </View>
        )}
      </ScrollView>
      </View>
  )
}

export default Tabs

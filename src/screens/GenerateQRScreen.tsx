import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'qrcode';
import { useColorScheme, useThemeColors } from '../hooks/useTheme';

type QRType = 'text' | 'url' | 'wifi' | 'email' | 'phone' | 'social';

interface QRTypeOption {
  type: QRType;
  icon: string;
  label: string;
  placeholder: string;
}

const QR_TYPES: QRTypeOption[] = [
  { type: 'text', icon: 'text', label: 'Plain Text', placeholder: 'Enter your text' },
  { type: 'url', icon: 'link', label: 'Website URL', placeholder: 'https://example.com' },
  { type: 'social', icon: 'logo-instagram', label: 'Social', placeholder: '@username' },
  { type: 'wifi', icon: 'wifi', label: 'WiFi', placeholder: 'Network name (SSID)' },
  { type: 'email', icon: 'mail', label: 'Email', placeholder: 'email@example.com' },
  { type: 'phone', icon: 'call', label: 'Phone Number', placeholder: '+1234567890' },
];

type SocialPlatform = 'instagram' | 'twitter' | 'facebook' | 'linkedin';

type EncryptionType = 'WEP' | 'WPA' | 'nopass';

const ENCRYPTION_TYPES: Array<{ label: string; value: EncryptionType }> = [
  { label: 'WEP', value: 'WEP' },
  { label: 'WPA/WPA2', value: 'WPA' },
  { label: 'None', value: 'nopass' },
];

export default function GenerateQRScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = useThemeColors();

  const [selectedType, setSelectedType] = useState<QRType>('text');
  const [content, setContent] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState<EncryptionType>('WPA');
  const [qrImage, setQrImage] = useState<string>('');
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform>('instagram');
  const [isHidden, setIsHidden] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, [content, wifiPassword, selectedType]);

  const getQRContent = () => {
    switch (selectedType) {
      case 'wifi':
        return `WIFI:T:${wifiEncryption};S:${content};P:${wifiPassword};;`;
      case 'email':
        return `mailto:${content}`;
      case 'phone':
        return `tel:${content}`;
      case 'social':
        const username = content.startsWith('@') ? content.substring(1) : content;
        switch (socialPlatform) {
          case 'instagram':
            return `https://instagram.com/${username}`;
          case 'twitter':
            return `https://twitter.com/${username}`;
          case 'facebook':
            return `https://facebook.com/${username}`;
          case 'linkedin':
            return `https://linkedin.com/in/${username}`;
          default:
            return content;
        }
      case 'url':
        return content.startsWith('http') ? content : `https://${content}`;
      default:
        return content;
    }
  };

  const generateQRCode = async () => {
    if (!content) {
      setQrImage('');
      return;
    }
    try {
      const qrData = getQRContent();
      const qrDataURL = await QRCode.toString(qrData, {
        type: 'svg',
        margin: 1,
        width: 200,
      });
      setQrImage(`data:image/svg+xml;utf8,${encodeURIComponent(qrDataURL)}`);
    } catch (err) {
      console.error('QR Code generation error:', err);
    }
  };

  const renderInputFields = () => {
    if (selectedType === 'wifi') {
      return (
        <View style={styles.wifiContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Network name (SSID) <Text style={{color: '#F06292'}}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="E.g. HomeWifi"
              value={content}
              onChangeText={setContent}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Network password</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g. Mypassword"
              value={wifiPassword}
              onChangeText={setWifiPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Type of encryption  <Text style={{color: '#F06292'}}>*</Text></Text>
            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => setIsPickerVisible(true)}
            >
              <Text style={styles.pickerButtonText}>{wifiEncryption}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            
            <Modal
              visible={isPickerVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setIsPickerVisible(false)}
            >
              <TouchableOpacity 
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setIsPickerVisible(false)}
              >
                <View style={styles.pickerModalContent}>
                  <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Encryption Type</Text>
                    <TouchableOpacity 
                      onPress={() => setIsPickerVisible(false)}
                      style={styles.pickerDoneButton}
                    >
                      <Text style={styles.pickerDoneText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.pickerOptionsContainer}>
                    {ENCRYPTION_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type.value}
                        style={[
                          styles.pickerOption,
                          wifiEncryption === type.value && styles.pickerOptionSelected
                        ]}
                        onPress={() => {
                          setWifiEncryption(type.value);
                          setIsPickerVisible(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerOptionText,
                          wifiEncryption === type.value && styles.pickerOptionTextSelected
                        ]}>
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, isHidden && styles.checkboxChecked]}
              onPress={() => setIsHidden(!isHidden)}
            >
              {isHidden && <Ionicons name="checkmark" size={18} color="white" />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Hidden network</Text>
          </View>
        </View>
      );
    }

    if (selectedType === 'social') {
      return (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Select Platform</Text>
          <View style={styles.socialButtonsContainer}>
            {['instagram', 'twitter', 'facebook', 'linkedin'].map((platform) => (
              <TouchableOpacity
                key={platform}
                style={[
                  styles.socialButton,
                  socialPlatform === platform && styles.selectedSocial,
                ]}
                onPress={() => setSocialPlatform(platform as SocialPlatform)}
              >
                <Ionicons
                  name={`logo-${platform}` as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={socialPlatform === platform ? '#F06292' : '#666'}
                />
                <Text style={[
                  styles.socialLabel,
                  socialPlatform === platform && styles.selectedSocialLabel
                ]}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.inputLabel}>Username <Text style={{color: '#F06292'}}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="@username"
            value={content}
            onChangeText={setContent}
          />
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.inputLabel}>
          {selectedType === 'url' ? 'Website URL' : 
           selectedType === 'email' ? 'Email Address' :
           selectedType === 'phone' ? 'Phone Number' : 
           'Text'} <Text style={{color: '#F06292'}}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder={QR_TYPES.find(t => t.type === selectedType)?.placeholder}
          value={content}
          onChangeText={setContent}
          keyboardType={selectedType === 'phone' ? 'phone-pad' : 'default'}
        />
      </View>
    );
  };

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      padding: 20,
    },
    typeSelector: {
      marginBottom: 20,
    },
    typeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 10,
    },
    typeButton: {
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.surface,
      alignItems: 'center',
      width: '48%',
    },
    selectedType: {
      backgroundColor: '#fce4ec',
    },
    typeLabel: {
      marginTop: 4,
      fontSize: 12,
      color: colors.textSecondary,
    },
    selectedTypeLabel: {
      color: '#F06292',
    },
    inputSection: {
      marginBottom: 20,
    },
    inputContainer: {
      gap: 10,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
      color: colors.text,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      backgroundColor: '#fff',
      overflow: 'hidden',
    },
    picker: {
      height: 48,
      backgroundColor: '#fff',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: '#ddd',
      marginRight: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: '#F06292',
      borderColor: '#F06292',
    },
    checkboxLabel: {
      fontSize: 14,
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      backgroundColor: colors.surface,
      color: colors.text,
    },
    qrContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 16,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      aspectRatio: 1,
      width: '100%',
    },
    qrImage: {
      width: '100%',
      height: '100%',
      maxWidth: 200,
      maxHeight: 200,
    },
    wifiContainer: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      gap: 16,
    },
    formGroup: {
      marginBottom: 8,
    },
    pickerButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      backgroundColor: '#fff',
    },
    pickerButtonText: {
      fontSize: 14,
      color: '#333',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      padding: 20,
    },
    pickerModalContent: {
      backgroundColor: '#fff',
      borderRadius: 12,
      overflow: 'hidden',
    },
    pickerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    pickerTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
    },
    pickerDoneButton: {
      padding: 4,
    },
    pickerDoneText: {
      color: '#F06292',
      fontSize: 16,
      fontWeight: '600',
    },
    pickerOptionsContainer: {
      padding: 8,
    },
    pickerOption: {
      padding: 16,
      borderRadius: 8,
    },
    pickerOptionSelected: {
      backgroundColor: '#fce4ec',
    },
    pickerOptionText: {
      fontSize: 16,
      color: '#333',
    },
    pickerOptionTextSelected: {
      color: '#F06292',
      fontWeight: '600',
    },
    socialButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    socialButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: '#f5f5f5',
      alignItems: 'center',
      width: '23%',
    },
    selectedSocial: {
      backgroundColor: '#fce4ec',
    },
    socialLabel: {
      marginTop: 4,
      fontSize: 10,
      color: '#666',
    },
    selectedSocialLabel: {
      color: '#F06292',
    },
    downloadButtonContainer: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    downloadButton: {
      backgroundColor: '#F06292',
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    downloadButtonDisabled: {
      backgroundColor: '#ffd0e0',
    },
  });

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.typeSelector}>
          <View style={styles.typeGrid}>
            {QR_TYPES.map((type) => (
              <TouchableOpacity
                key={type.type}
                style={[
                  styles.typeButton,
                  selectedType === type.type && styles.selectedType,
                ]}
                onPress={() => {
                  setSelectedType(type.type);
                  setContent('');
                  setWifiPassword('');
                }}
              >
                <Ionicons 
                  name={type.icon as keyof typeof Ionicons.glyphMap} 
                  size={24} 
                  color={selectedType === type.type ? '#F06292' : '#666'} 
                />
                <Text style={[
                  styles.typeLabel,
                  selectedType === type.type && styles.selectedTypeLabel,
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputSection}>
          {renderInputFields()}
        </View>

        {qrImage && (
          <View style={styles.qrContainer}>
            <Image
              source={{ uri: qrImage }}
              style={styles.qrImage}
            />
          </View>
        )}
      </ScrollView>
      <View style={styles.downloadButtonContainer}>
        <TouchableOpacity
          style={[
            styles.downloadButton,
            !content && styles.downloadButtonDisabled
          ]}
          onPress={() => {
            
          }}
          disabled={!content}
        >
          <Ionicons 
            name="download-outline" 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 